const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/game");
const { sendGameState } = require("./sendGameState");

const start = async (request, response) => {
  const { id: gameId } = request.params;
  const gameSocketId = await Games.getGameSocket(gameId);

  // Initialize game in database
  await Games.initializeGame(gameId);

  // Send start signal to game
  const io = request.app.get("io");
  io.emit(GAME_CONSTANTS.START, {});

  await sendGameState(io, gameId);

  response.status(200);
}

module.exports = { start };