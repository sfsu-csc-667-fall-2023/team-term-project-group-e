const { Games, Users } = require("../../db");
const { canPlayCard } = require("./canPlayCard");
const { sendGameState } = require("./sendGameState");
const { setNextPlayer } = require("./setNextPlayer");
const { getNextPlayer } = require("./getNextPlayer");
const USER_CONSTANTS = require("../../../constants/user");

const draw = async (request, response) => {
  const { id: userId } = request.session.user;
  const { id: gameId } = request.params;
  const { sid: userSocketId } = await Users.getUserSocket(userId);
  const io = request.app.get("io");

  // Add a random card to the user's hand in the database.
  const randomCard = await Games.getRandomCard(gameId);
  await Games.setGameCard(userId, randomCard.card_id, gameId);

  // Check if that card can be played.
  const canPlay = await canPlayCard(randomCard.card_id, gameId);

  io.to(userSocketId).emit(USER_CONSTANTS.REMOVE_DRAW_CARD, {});

  //If the card can't be played, move to the next player.
  if(!canPlay){
    console.log("The card drawn can not be played.");
    const nextPlayer = await getNextPlayer(gameId);
    console.log({ nextPlayer });
    await setNextPlayer(nextPlayer.user_id, gameId);
  } 

  await sendGameState(io, gameId);

  response.status(200).send();
}

module.exports = { draw };