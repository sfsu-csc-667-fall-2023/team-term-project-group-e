const {connection: db} = require("../connection");

const GET_AVAILABLE_GAMES = "SELECT * FROM games";

const getAvailableGames = () => db.any(GET_AVAILABLE_GAMES);

module.exports = { getAvailableGames };