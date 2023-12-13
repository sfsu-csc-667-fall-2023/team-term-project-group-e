const {connection: db} = require("../connection");

const SET_GAME_DIRECTION = "UPDATE games SET direction=$1 WHERE id=$2";

const setGameDirection = (direction, gameId) => db.none(SET_GAME_DIRECTION, [direction, gameId]);

module.exports = { setGameDirection };