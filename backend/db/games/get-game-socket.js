const {connection: db} = require("../connection");

const GET_GAME_SOCKET = "SELECT game_socket_id FROM games WHERE id=$1";

const getGameSocket = (gameId) => {
  console.log({ gameId });
  db.one(GET_GAME_SOCKET, [gameId])
};

module.exports = { getGameSocket };
