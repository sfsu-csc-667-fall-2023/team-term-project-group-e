const { Games, Users } = require("../../db");
const { canPlayCard } = require("./canPlayCard");
const { sendGameState } = require("./sendGameState");
const { setNextPlayer } = require("./setNextPlayer");
const { getNextPlayer } = require("./getNextPlayer");
const USER_CONSTANTS = require("../../../constants/user");

const draw = async (request, response) => {
  const { id: userId } = request.session.user;
  const { id: gameId } = request.params;

  // Add a random card to the user's hand in the database.
  const randomCard = await Games.getRandomCard(gameId);
  await Games.setGameCard(userId, randomCard.card_id, gameId);

  // Check if that card can be played.
  const canPlay = canPlayCard(randomCard.card_id, gameId);
   
  //If the card can't be played, move to the next player.
  if(!canPlay){
    const nextPlayer = await getNextPlayer(gameId);
    await setNextPlayer(nextPlayer.user_id);

    response.status(200).send();
    return;
  } 

  const io = request.app.get("io");
  const { sid: userSocketId } = await Users.getUserSocket(userId);
  io.to(userSocketId).emit(USER_CONSTANTS.REMOVE_DRAW_CARD, {});

  await sendGameState(io, gameId);

  response.status(200).send();
}

module.exports = { draw };