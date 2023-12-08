const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/game");
const USER_CONSTANTS = require("../../../constants/user");

const start = async (request, response) => {
  const { id: gameId } = request.params;
  const firstPlayer = await Games.initializeGame(gameId);

  const io = request.app.get("io");
  io.emit(GAME_CONSTANTS.START, {});

  const players = await Games.getUsersInGame(gameId);
  for (const player of players) {
    const userId = parseInt(player.user_id);
    const { sid: userSocketId } = await Users.getUserSocket(userId);

    const hand = await Games.getHandOfPlayer(userId, gameId);
    io.to(userSocketId).emit(USER_CONSTANTS.HAND, { hand });

    if(userId === firstPlayer.user_id)
      io.to(userSocketId).emit(USER_CONSTANTS.CURRENT);
    else 
      io.to(userSocketId).emit(USER_CONSTANTS.NOT_CURRENT);
  }

  response.status(200).send();
}

module.exports = { start };