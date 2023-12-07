const {connection: db} = require("./connection");
const Users = require("./users");

const { create } = require("./games/create");
const { addUser } = require("./games/add-user");
const { getGame } = require("./games/get-game");
const { getAvailableGames } = require("./games/get-available-games");
const { userCount } = require("./games/get-user-count");

const { createShuffledDeck } = require("./games/create-shuffled-deck");
const { setCurrentPlayer } = require("./games/set-current-player");
const { getPlayerBySeat } = require("./games/get-player-by-seat");

/* Game State Functions */
// const SHUFFLED_DECK = "SELECT *, random() AS rand FROM cards ORDER BY rand";
// const SET_CURRENT_PLAYER = "UPDATE games SET current_seat=0 WHERE id=$1";
// const GET_PLAYER_BY_SEAT = "SELECT user_id FROM game_users WHERE seat=$1 AND game_id=$2";
const GET_CARDS = "SELECT card_id FROM game_cards WHERE game_id=$1 AND user_id=0 ORDER BY card_order LIMIT $2";
const GET_USERS = "SELECT user_id FROM game_users WHERE game_id=$1";
const DEAL_CARD = "UPDATE game_cards SET user_id=$1 WHERE game_id=$2 AND card_id=$3";

const initialize = async (gameId) => {
  // Create game deck of shuffled cards
  // const shuffledDeck = await db.many(SHUFFLED_DECK);
  // const columns = new pgp.helpers.ColumnSet(['user_id', 'game_id', 'card_id', 'card_order'], {table: 'game_cards'});
  // const values = shuffledDeck.map(({ id }, index) => ({
  //   user_id: 0,
  //   game_id: gameId,
  //   card_id: id,
  //   card_order: index,
  // }));

  // const query = pgp.helpers.insert(values, columns);
  // await db.none(query); 

  await createShuffledDeck(gameId);

  // Set current player
  const firstPlayer = await getPlayerBySeat(0, gameId).then(({ user_id }) => setCurrentPlayer(user_id, gameId));
  // const { user_id: firstPlayer } = await db.one(GET_PLAYER_BY_SEAT, [0, gameId])
  // await db.none(SET_CURRENT_PLAYER, [firstPlayer, gameId])

  // Deal cards to each player
  const users = await db.many(GET_USERS, [gameId])
    .then(userResult => {
      console.log({ userResult })
      return userResult
    })
    
    .then(userResult => Promise.all([
      userResult, 
      ... userResult.map(({ user_id }) => Users.getUserSocket(parseInt(user_id)))
    ]))
    .then(([userResult, ... userSids]) => 
      userResult.map(({ user_id }, index) => ({ user_id, sid: userSids[index].sid }))
    )

  const cards = await db.many(GET_CARDS, [gameId, users.length * 2 + 2]);
  await Promise.all(
    cards.slice(0, cards.length-2).map(({ card_id }, index) => db.none(DEAL_CARD, [users[index % users.length].user_id, gameId, card_id]))
  );
  await Promise.all(
    cards.slice(cards.length - 2).map(({ card_id }) => db.none(DEAL_CARD, [-1, gameId, card_id]))
  );

  // Send each player their cards
  // current state of game: firstPlayer, dealerCards
  // user state: each players' hands
  const hands = await db.many("SELECT game_cards.*, cards.* FROM game_cards, cards WHERE game_id=$1 AND game_cards.card_id=cards.id", [gameId]);

  return {
    current_player: firstPlayer,
    hands: hands.reduce((memo, entry) => {
      if(entry.user_id !== 0){
        memo[entry.user_id] = memo[entry.user_id] || [];
        memo[entry.user_id].push(entry);
      }
      return memo;
    }, {})
  }
}

module.exports = {
  create, addUser, getGame, getAvailableGames, userCount, initialize
}