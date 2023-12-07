const {connection: db} = require("../connection");
const { getUsersInGame } = require("./get-users-in-game");

const DEAL_CARD = "UPDATE game_cards SET user_id=$1 WHERE game_id=$2 AND card_order=$3";

const dealCards = async (gameId) => {
  const users = await getUsersInGame(gameId);

  let cardIndex = 0;
  users.map((user) => {
    for(let i = 0; i < 7; i++){
      db.none(DEAL_CARD, [user.user_id, gameId, cardIndex]);
      cardIndex++;
    }
  });
  
}

module.exports = { dealCards };