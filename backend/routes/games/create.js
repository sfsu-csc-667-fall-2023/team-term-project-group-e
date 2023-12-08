const crypto = require("crypto");
const { Games } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/game");

const create = async (request, response) => {
  const { id: userId } = request.session.user;
  const io = request.app.get("io");

  const { id: gameId } = await Games.createGame(
    crypto.randomBytes(20).toString('hex')
  );
  await Games.addUser(userId, gameId);

  io.emit(GAME_CONSTANTS.CREATED, { id: gameId });

  response.redirect(`/game/${gameId}`);
}

module.exports = { create };