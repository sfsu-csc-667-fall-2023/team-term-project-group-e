const { connection: db } = require("../connection");

const GET_GAME_INFO = `select 
  count(game_cards.card_id), 
  users.username, 
  users.id 
  from game_cards 
  inner join 
  users on 
  game_cards.user_id=users.id 
  where game_cards.game_id=$1 
  group by users.id`;

const getGameInfo = (gameId) => db.many(GET_GAME_INFO, [gameId]);

module.exports = { getGameInfo };

