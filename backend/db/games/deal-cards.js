const { connection: db } = require("../connection");
const { getUsersInGame } = require("./get-users-in-game");

const DEAL_CARD = "UPDATE game_cards SET user_id=$1 WHERE game_id=$2 AND card_order=$3";

const dealCards = async (gameId) => {
  const users = await getUsersInGame(gameId);

  return Promise.all(users.reduce((memo, { user_id }, index) => {
    for (let cardIndex = 0; cardIndex < 7; cardIndex++) {
      memo.push(
        db.none(DEAL_CARD, [user_id, gameId, index * 7 + cardIndex])
      );
    }

    return memo;
  }, []));
}

module.exports = { dealCards };