const { connection: db } = require("../connection");

const SET_CURRENT_COLOR = "UPDATE games SET current_color=$1 WHERE id=$2";

const setCurrentColor = (color, gameId) => db.none(SET_CURRENT_COLOR, [color, gameId]);

module.exports = { setCurrentColor };
