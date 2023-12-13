const { connection: db } = require("../connection");

const GET_GAME_INFO = "SELECT count(game_cards.card_id), users.username, users.id FROM game_cards INNER JOIN users ON game_cards.user_id=users.id WHERE game_cards.game_id=$1 GROUP BY users.id";

const getGameInfo = (gameId) => db.many(GET_GAME_INFO, [gameId]);

module.exports = { getGameInfo };

