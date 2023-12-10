const { Games } = require("../../db");
const { canPlayCard } = require("./canPlayCard");
const { nextPlayer } = require("./nextPlayer");
const { sendGameState } = require("./sendGameState");

const draw = async (request, response) => {
  const { id: userId } = request.session.user;
  const { id: gameId } = request.params;

  // Add a random card to the user's hand in the database.
  const randomCard = await Games.getRandomCard(gameId);
  await Games.setGameCard(userId, randomCard.card_id, gameId);

  // Check if that card can be played.
  const cardInfo = await Games.getCardInfo(randomCard.card_id);
  const faceUpCard = await Games.getFaceUpCard(gameId);
  const faceUpCardInfo = await Games.getCardInfo(faceUpCard);

  const canPlay = canPlayCard(cardInfo, faceUpCardInfo);
   
  //If the card can't be played, move to the next player.
  if(!canPlay){
    await nextPlayer(gameId);

    response.status(200).send();
    return;
  } 

  await sendGameState(gameId)

  response.status(200).send();
}

module.exports = { draw };