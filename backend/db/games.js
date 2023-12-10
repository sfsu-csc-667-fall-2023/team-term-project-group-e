// Exported Functions
const { addUserToGame } = require("./games/add-user-to-game");
const { createGame } = require("./games/create-game");
const { getAvailableGames } = require("./games/get-available-games");
const { getGameInfo } = require("./games/get-game-info");
const { getGameSocket } = require("./games/get-game-socket");
const { getHandOfPlayer } = require("./games/get-hand-of-player");
const { getRandomCard } = require("./games/get-random-card");
const { getUserCount } = require("./games/get-user-count");
const { getUsersInGame } = require("./games/get-users-in-game");
const { setCurrentPlayer } = require("./games/set-current-player");
const { setGameDirection } = require("./games/set-game-direction");

// Helper Functions
const { createShuffledDeck } = require("./games/create-shuffled-deck");
const { dealStartingCards } = require("./games/deal-starting-cards");
const { getPlayerBySeat } = require("./games/get-player-by-seat");
const { setGameInitialized } = require("./games/set-game-initialized");

const initializeGame = async (gameId) => {
  await setGameInitialized(gameId);
  await createShuffledDeck(gameId);
  await dealStartingCards(gameId);

  const firstPlayer = await getPlayerBySeat(1, gameId);
  await setCurrentPlayer(firstPlayer.user_id, gameId);

  return firstPlayer;
}

module.exports = {
  addUserToGame,
  createGame,
  getAvailableGames,
  getGameInfo,
  getGameSocket,
  getHandOfPlayer,
  getRandomCard,
  getUserCount,
  getUsersInGame,
  initializeGame,
  setGameDirection,
}