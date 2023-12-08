const { connection: db } = require("../connection");

const GET_RANDOM_CARD = "SELECT card_id FROM game_cards WHERE game_id=$1 AND user_id=0 ORDER BY random() LIMIT 1";

const getRandomCard = (gameId) => db.one(GET_RANDOM_CARD, [gameId]);

module.exports = { getRandomCard };