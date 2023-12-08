const { connection: db } = require("../connection");

const ADD_USER_TO_GAME = "INSERT INTO game_users (user_id, game_id, seat) VALUES ($1, $2, $3)";

// Adds a user to a game. First user will be in seat 1, second user in seat 2, etc.
const addUserToGame = (userId, gameId) => userCount(gameId).then(
  playerCount => db.none(ADD_USER_TO_GAME, [userId, gameId, playerCount + 1]) 
);

module.exports = { addUserToGame };