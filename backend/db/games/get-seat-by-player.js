const { connection: db } = require("../connection");

const GET_SEAT_BY_PLAYER = "SELECT seat FROM game_users WHERE user_id=$1 AND game_id=$2";

const getSeatByPlayer = (userId, gameId) => db.one(GET_SEAT_BY_PLAYER, [userId, gameId]);

module.exports = { getSeatByPlayer }; 