const {connection: db} = require("../connection");

const SET_GAME_INITIALIZED = "UPDATE games SET initialized=true WHERE id=$1";

const setGameInitialized = (gameId) => db.none(SET_GAME_INITIALIZED, [gameId]);

module.exports = { setGameInitialized };