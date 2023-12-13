const { connection: db } = require("../connection");

const GET_AVAILABLE_GAMES = "SELECT * FROM games WHERE initialized=false";

const getAvailableGames = () => db.any(GET_AVAILABLE_GAMES);

module.exports = { getAvailableGames };