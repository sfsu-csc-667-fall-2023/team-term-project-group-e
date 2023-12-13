const {connection: db} = require("../connection");

const GET_COUNT_OF_HAND = "SELECT count(card_id) FROM game_cards WHERE user_id=$1 AND game_id=$2";

const getCountOfHand = (userId, gameId) => db.one(GET_COUNT_OF_HAND, [userId, gameId]);

module.exports = { getCountOfHand };