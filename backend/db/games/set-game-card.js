const { connection: db } = require("../connection");

const SET_GAME_CARD = "UPDATE game_cards SET user_id=$1 WHERE card_id=$2 AND game_id=$3";

const setGameCard = (user_id, card_id, game_id) => db.none(SET_GAME_CARD, [user_id, card_id, game_id]);

module.exports = { setGameCard };