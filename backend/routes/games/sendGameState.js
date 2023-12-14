const { Games } = require("../../db");
const { Users } = require("../../db");

const GAME_CONSTANTS = require("../../../constants/game");
const USER_CONSTANTS = require("../../../constants/user");
const { checkHand } = require("./checkHand");
const { checkWinState } = require("./checkWinState");

const sendGameState = async (io, gameId) => {
  // need to make sure to emit to specific socket later
  const gameSocketId = await Games.getGameSocket(gameId);

  const winnerId = await checkWinState(gameId);
  if(winnerId !== -1){
    const winner = await Games.getUsername(winnerId);
    io.emit(GAME_CONSTANTS.WINNER, { winner });
    return;
  }

  // Emit game info (usernames + their card counts) to the game socket.
  const gameInfo = await Games.getGameInfo(parseInt(gameId));
  io.emit(GAME_CONSTANTS.GAME_INFO, { gameInfo });  
 
  // Emit current player to the game socket.
  const currentPlayerId = await Games.getCurrentSeat(parseInt(gameId));
  const currentPlayer = await Games.getUsername(currentPlayerId.current_seat);
  io.emit(GAME_CONSTANTS.USER_CURRENT, { currentPlayer });

  // Emit face up card info to the game socket.
  const faceUpCardId = await Games.getFaceUpCard(parseInt(gameId));
  const faceUpCard = await Games.getCardInfo(faceUpCardId.card_id);
  const faceUpColor = await Games.getCurrentColor(gameId);
  io.emit(GAME_CONSTANTS.FACE_UP_CARD, {faceUpCard, faceUpColor});

  // Emit hand info and current / not-current statuses to each player.
  const players = await Games.getUsersInGame(parseInt(gameId));
  for (const player of players) {
    // Get id and socket
    const id = parseInt(player.user_id);
    const { sid: userSocketId } = await Users.getUserSocket(id);

    // Send hand
    const cards = await Games.getHandOfPlayer(id, gameId);
    let hand = [];
    for (const card of cards){
      hand.push(await Games.getCardInfo(card.card_id));
    }
    io.to(userSocketId).emit(USER_CONSTANTS.HAND, { hand });

    // Send status
    if(id === currentPlayerId.current_seat){
      if(!await checkHand(gameId)){
        io.to(userSocketId).emit(USER_CONSTANTS.MUST_DRAW_CARD, {});        
      }
      io.to(userSocketId).emit(USER_CONSTANTS.CURRENT, {});
    } else {
      io.to(userSocketId).emit(USER_CONSTANTS.NOT_CURRENT, {});
    }
  }
}

module.exports = { sendGameState };