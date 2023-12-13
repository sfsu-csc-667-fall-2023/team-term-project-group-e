const { connection: db } = require("../connection");

const GET_CARD_INFO = "SELECT * FROM cards WHERE id=$1";

const getCardInfo = (card_id) => db.one(GET_CARD_INFO, [card_id]);

module.exports = { getCardInfo };