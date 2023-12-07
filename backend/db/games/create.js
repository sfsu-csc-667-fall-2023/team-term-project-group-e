const {connection: db} = require("../connection");

const CREATE = "INSERT INTO games (game_socket_id) VALUES ($1) RETURNING id";

const create = (gameSocketId) => db.one(CREATE, [gameSocketId]);

module.exports = { create };