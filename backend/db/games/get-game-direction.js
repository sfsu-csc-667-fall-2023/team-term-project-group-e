const { connection: db } = require("../connection");

const GET_GAME_DIRECTON = "SELECT direction FROM games WHERE id=$1";

const getGameDirection = (gameId) => db.one(GET_GAME_DIRECTON, [gameId]);

module.exports = { getGameDirection };