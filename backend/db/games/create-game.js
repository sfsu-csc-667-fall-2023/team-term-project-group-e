const { connection: db } = require("../connection");

const CREATE_GAME = "INSERT INTO games (game_socket_id, direction, initialized) VALUES ($1, 'forward', false) RETURNING id";

const createGame = (gameSocketId) => db.one(CREATE_GAME, [gameSocketId]);

module.exports = { createGame };