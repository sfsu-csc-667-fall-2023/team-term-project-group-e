const { Games, Users } = require("../../db");
const { canPlayCard } = require("./canPlayCard");
const { nextPlayer } = require("./nextPlayer");
const { sendGameState } = require("./sendGameState");

const USER_CONSTANTS = require("../../../constants/user");
const GAME_CONSTANTS = require("../../../constants/game"); 

const play = async (request, response) => {
  const { id: userId } = request.session.user;
  const { id: gameId, id: cardId } = request.params;
  console.log({ cardId });
  const { sid: userSocketId } = await Users.getUserSocket(userId);
  const io = request.app.get("io");

  /* 
  Card that is sent in the request body. Color is for the change_color functionality
  'none' = normal color 'everything_else' = color the user wants to change it to. 
  */
  const { card_id, color } = request.body;  

  // Check if the card can be played based on the face up card.
  const faceUpCard = await Games.getFaceUpCard(gameId);
  const faceUpCardInfo = await Games.getCardInfo(faceUpCard.card_id);
  const cardInfo = await Games.getCardInfo(card_id);
  const canPlay = canPlayCard(cardInfo, faceUpCardInfo);

  // If card can't be played, emit a CANT_PLAY_CARD signal.
  if(!canPlay){
    io.to(userSocketId).emit(USER_CONSTANTS.CANT_PLAY_CARD, {});
    response.status(200).send();
    return;
  }

  await Games.setGameCard(0, faceUpCard.card_id, gameId);   // Set current face up card to 0 (it's in the deck now)
  await Games.setGameCard(-1, card_id, gameId);   // Set the face up card to card_id from request body (change it from user_id to -1)

  // Check for modifiers / effects
  // Update the database depending on what modifiers are played.
  if(card.modifier !== 'none'){
    switch(card.modifier){
      case 'skip':
        const currentSeat = await Games.getCurrentSeat(gameId);
        const numOfPlayers = await Games.getUserCount(gameId);

        await Games.setCurrentPlayer(nextPlayer, gameId);

        break;
      case 'add_2':

        break;

      case 'reverse':
        break;
      case 'change_color':
        break;

      case 'change_color_add_4':

        break;

    }
  }

  await nextPlayer(gameId);

  await sendGameState(gameId);

  // check if seat can play a card. if they can't add draw card button for them.

  response.status(200).send();
}

module.exports = { play };