const { connection: db } = require("../connection");

const GET_FACE_UP_CARD = "Select card_id from game_cards where user_id=-1 and game_id=$1;";

const getFaceUpCard = (gameId) => db.one(GET_FACE_UP_CARD, [gameId]);

module.exports = { getFaceUpCard };