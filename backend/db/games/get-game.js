const {connection: db} = require("../connection");

const GET_GAME = "SELECT * FROM games WHERE id=$1"

const getGame = (gameId) => db.one(GET_GAME, gameId);

module.exports = { getGame };