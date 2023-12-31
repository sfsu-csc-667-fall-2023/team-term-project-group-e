const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/game");

const join = async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId, email: userEmail } = request.session.user;
  const { game_socket_id: gameSocketId }= await Games.getGameSocket(gameId);
  console.log({ gameSocketId });

  const io = request.app.get("io");

  await Games.addUserToGame(userId, gameId);

  io.to(gameSocketId).emit(GAME_CONSTANTS.USER_ADDED, { userId, userEmail, gameId });

  const userCount = await Games.getUserCount(gameId);

  if (userCount > 1) {
    io.to(gameSocketId).emit(GAME_CONSTANTS.READY, {});
  }

  response.redirect(`/game/${gameId}`);
}

module.exports = { join };