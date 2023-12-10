const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/game");
const USER_CONSTANTS = require("../../../constants/user");

const start = async (request, response) => {
  const { id: gameId } = request.params;
  const { game_socket_id: gameSocketId } = await Games.getGameSocket(gameId);

  // Initialize game in database
  const firstPlayer = await Games.initializeGame(gameId);

  // Send start signal to game
  const io = request.app.get("io");
  io.to(gameSocketId).emit(GAME_CONSTANTS.START, {});

  const players = await Games.getUsersInGame(gameId);

  // Send hands to each user
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

  // Send names of users + card counts to game
  const userInfos = await Games.getGameInfo(gameId);
  io.to(gameSocketId).emit(GAME_CONSTANTS.GAME_INFO, {userInfos});

  // Send face up card
  response.status(200).send();
}

module.exports = { start };