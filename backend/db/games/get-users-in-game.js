const {connection: db} = require("../connection");

const GET_USERS = "SELECT user_id FROM game_users WHERE game_id=$1";

const getUsersInGame = (gameId) => db.many(GET_USERS, [gameId]);

module.exports = { getUsersInGame };