const {connection: db, pgp} = require("../connection");

const SHUFFLED_DECK = "SELECT *, random() AS rand FROM cards ORDER BY rand";

const createShuffledDeck = (gameId) => 
  db.many(SHUFFLED_DECK).then((shuffledDeck) => {
    // Set columns
    const columns = new pgp.helpers.ColumnSet(
      ['user_id', 'game_id', 'card_id', 'card_order'], 
      {table: 'game_cards'}
    );

    // Set values of shuffled deck
    const values = shuffledDeck.map(({ id }, index) => ({
      user_id: 0,
      game_id: gameId,
      card_id: id,
      card_order: index,
    }));

    // Insert shuffled deck into game cards
    const query = pgp.helpers.insert(values, columns);

    return db.none(query); 
  });

module.exports = { createShuffledDeck };