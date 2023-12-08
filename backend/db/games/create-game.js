const { connection: db } = require("../connection");

const CREATE_GAME = "INSERT INTO games (game_socket_id) VALUES ($1) RETURNING id";

const createGame = (gameSocketId) => db.one(CREATE_GAME, [gameSocketId]);

module.exports = { createGame };