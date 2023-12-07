const {connection: db} = require("../connection");

const GET_HAND = "SELECT card_id FROM game_cards WHERE user_id=$1 AND game_id=$2";

const getHandOfPlayer = (userId, gameId) => db.many(GET_HAND, [userId, gameId]);

module.exports = { getHandOfPlayer };
