const { Games, Users } = require("../../db");
const { canPlayCard } = require("./canPlayCard");
const { setNextPlayer } = require("./setNextPlayer");
const { getNextPlayer } = require("./getNextPlayer");
const { sendGameState } = require("./sendGameState");

const USER_CONSTANTS = require("../../../constants/user");
const GAME_CONSTANTS = require("../../../constants/game"); 

const play = async (request, response) => {
  const { id: userId } = request.session.user;
  const { game_id: gameId } = request.params;
  const { sid: userSocketId } = await Users.getUserSocket(userId);
  const io = request.app.get("io");

  const { card_id: cardId } = request.body;
  console.log({ gameId, cardId });

  // 
  if(cardId < 0){
    console.log("change color card");
    response.status(200).send();
    return;
  } 

  // Check if the card can be played based on the face up card.
  const faceUpCard = await Games.getFaceUpCard(gameId);
  const faceUpCardInfo = await Games.getCardInfo(faceUpCard.card_id);
  const cardInfo = await Games.getCardInfo(cardId);
  const canPlay = canPlayCard(cardInfo, faceUpCardInfo);

  // If card can't be played, emit a CANT_PLAY_CARD signal.
  if(!canPlay){
    io.to(userSocketId).emit(USER_CONSTANTS.CANT_PLAY_CARD, {});
    response.status(200).send();
    return;
  }

  await Games.setGameCard(0, faceUpCard.card_id, gameId);   // Set current face up card to 0 (it's in the deck now)
  await Games.setGameCard(-1, cardId, gameId);   // Set the face up card to card_id from request body (change it from user_id to -1)

  switch(cardInfo.modifier){
    case 'add_2':

      const nextPlayer1 = await getNextPlayer(gameId);
      await setNextPlayer(nextPlayer1.user_id, gameId);

      for(let i = 0; i < 2; i++){
        const card = await Games.getRandomCard(gameId);
        await Games.setGameCard(nextPlayer.user_id, card.card_id, gameId);
      }

      break;
    case 'skip':
      const nextPlayer2 = await getNextPlayer(gameId);
      await setNextPlayer(nextPlayer2.user_id, gameId);
      break;
    case 'reverse':
      const direction = await Games.getGameDirection(gameId);
      if(direction.direction === 'forward'){
        await Games.setGameDirection('backward', gameId);
      } else {
        await Games.setGameDirection('forward', gameId);
      }
      break;
  }
  // do stuff

  const nextPlayer = await getNextPlayer(gameId);
  await setNextPlayer(nextPlayer.user_id, gameId);

  await sendGameState(io, gameId);

  // check if seat can play a card. if they can't add draw card button for them.

  response.status(200).send();
}

module.exports = { play };