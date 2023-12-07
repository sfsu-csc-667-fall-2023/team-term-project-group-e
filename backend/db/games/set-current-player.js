const {connection: db} = require("../connection");

const SET_CURRENT_PLAYER = "UPDATE games SET current_seat=$1 WHERE id=$2";

const setCurrentPlayer = (playerId, gameId) => db.none(SET_CURRENT_PLAYER, [playerId, gameId]);

module.exports = { setCurrentPlayer };