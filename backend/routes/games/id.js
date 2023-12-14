const { Games, Users } = require("../../db");

const id = async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId } = request.session.user;
  const { game_socket_id: gameSocketId }= await Games.getGameSocket(gameId);
  const { sid: userSocketId } = await Users.getUserSocket(userId);

  response.render("game", { gameId, gameSocketId, userSocketId });
}

module.exports = { id };