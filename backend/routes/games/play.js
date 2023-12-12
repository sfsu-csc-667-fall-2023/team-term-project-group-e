const { Games, Users } = require("../../db");
const { canPlayCard } = require("./canPlayCard");
const { setNextPlayer } = require("./setNextPlayer");
const { getNextPlayer } = require("./getNextPlayer");
const { sendGameState } = require("./sendGameState");

const USER_CONSTANTS = require("../../../constants/user");

const play = async (request, response) => {
  console.log("Card played");
  const { id: userId } = request.session.user;
  const { id: gameId } = request.params;
  const { sid: userSocketId } = await Users.getUserSocket(userId);
  const io = request.app.get("io");

  const body = request.body;
  const cardId = body.card_id;
  const color = body.color;

  let seat = await Games.getCurrentSeat(gameId);
  if(userId !== seat.current_seat){
    response.status(200).send();
    return;
  }

  // Check if the card can be played based on the face up card.
  const canPlay = await canPlayCard(cardId, gameId);

  // If card can't be played, emit a CANT_PLAY_CARD signal.
  if(!canPlay){
    io.to(userSocketId).emit(USER_CONSTANTS.CANT_PLAY_CARD, {});
    response.status(200).send();
    return;
  }

  const currentCard = await Games.getFaceUpCard(gameId);

  await Games.setGameCard(0, currentCard.card_id, gameId);   // Set current face up card to 0 (it's in the deck now)
  await Games.setGameCard(-1, cardId, gameId);   // Set the face up card to card_id from request body (change it from user_id to -1)
  await Games.setCurrentColor(color, gameId);
  console.log({ color });

  const cardInfo = await Games.getCardInfo(cardId);

  switch(cardInfo.modifier){
    case 'add_2':

      // Move to next player
      const nextPlayer1 = await getNextPlayer(gameId);
      await setNextPlayer(nextPlayer1.user_id, gameId);

      // Add two random cards to player
      for(let i = 0; i < 2; i++){
        const card = await Games.getRandomCard(gameId);
        await Games.setGameCard(nextPlayer1.user_id, card.card_id, gameId);
      }

      break;
    case 'skip':
      // Move to next player
      const nextPlayer2 = await getNextPlayer(gameId);
      await setNextPlayer(nextPlayer2.user_id, gameId);
      break;
    case 'reverse':

      // Change direction
      const direction = await Games.getGameDirection(gameId);
      if(direction.direction === 'forward'){
        await Games.setGameDirection('backward', gameId);
      } else {
        await Games.setGameDirection('forward', gameId);
      }
      break;
    case 'change_color':
      // Set new color
      await Games.setCurrentColor(color);
      break;
    case 'change_color_add_4':
      // Set new color
      await Games.setCurrentColor(color);

      // Move to next player
      const nextPlayer3 = await getNextPlayer(gameId);
      await setNextPlayer(nextPlayer3.user_id, gameId);

      // Add two random cards to player
      for(let i = 0; i < 4; i++){
        const card = await Games.getRandomCard(gameId);
        await Games.setGameCard(nextPlayer3.user_id, card.card_id, gameId);
      }
      break;
  }

  // Move to next player
  const nextPlayer = await getNextPlayer(gameId);
  await setNextPlayer(nextPlayer.user_id, gameId);

  await sendGameState(io, gameId);

  // check if seat can play a card. if they can't add draw card button for them.
  response.status(200).send();
}

module.exports = { play };