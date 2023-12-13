const { connection: db } = require("../connection");

const GET_CURRENT_COLOR = "SELECT current_color FROM games WHERE id=$1";

const getCurrentColor = (gameId) => db.one(GET_CURRENT_COLOR, [gameId]);

module.exports = { getCurrentColor };