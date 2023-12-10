const { connection: db } = require("../connection");

const GET_CURRENT_SEAT = "SELECT current_seat FROM games WHERE id=$1";

const getCurrentSeat = (gameId) => db.one(GET_CURRENT_SEAT, [gameId]);

module.exports = { getCurrentSeat };