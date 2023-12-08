// Exported Functions
const { addUserToGame } = require("./games/add-user-to-game");
const { createGame } = require("./games/create-game");
const { getAvailableGames } = require("./games/get-available-games");
const { getGame } = require("./games/get-game");
const { getHandOfPlayer } = require("./games/get-hand-of-player");
const { getRandomCard } = require("./games/get-random-card");
const { getUserCount } = require("./games/get-user-count");
const { getUsersInGame } = require("./games/get-users-in-game");
const { setCurrentPlayer } = require("./games/set-current-player");

// Helper Functions
const { createShuffledDeck } = require("./games/create-shuffled-deck");
const { dealStartingCards } = require("./games/deal-starting-cards");
const { getPlayerBySeat } = require("./games/get-player-by-seat");

const initializeGame = async (gameId) => {
  await createShuffledDeck(gameId);

  const firstPlayer = await getPlayerBySeat(1, gameId);
  await setCurrentPlayer(firstPlayer.user_id, gameId);

  await dealStartingCards(gameId);

  return firstPlayer;
}

module.exports = {
  addUserToGame,
  createGame,
  getAvailableGames,
  getGame,
  getHandOfPlayer,
  getRandomCard,
  getUserCount,
  getUsersInGame,
  initializeGame,
}