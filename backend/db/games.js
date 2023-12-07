const db = require("./connection");

/* Creating games */
const CREATE = "INSERT INTO games (game_socket_id) VALUES ($1) RETURNING id";
const ADD_USER = "INSERT INTO game_users (user_id, game_id, seat) VALUES ($1, $2, $3)";
const GET_GAME = "SELECT * FROM games WHERE id=$1"
const GET_AVAILABLE_GAMES = "SELECT * FROM games";
const GET_USER_COUNT = "SELECT COUNT(*) FROM game_users WHERE game_id=$1";

const create = (gameSocketId) => db.one(CREATE, [gameSocketId]);
const addUser = (userId, gameId) => userCount(gameId).then(
  playerCount => db.none(ADD_USER, [userId, gameId, playerCount + 1]) // First player in will be in seat 1, second player seat 2, etc.
);
const getGame = (gameId) => db.one(GET_GAME, gameId);
const getAvailableGames = () =>db.any(GET_AVAILABLE_GAMES);
const userCount = (gameId) => db.one(GET_USER_COUNT, [gameId])
  .then(({ count }) => parseInt(count));

const initialize = () => {
  
}

module.exports = {
  create, addUser, getGame, getAvailableGames, userCount
}