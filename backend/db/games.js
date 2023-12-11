// Exported Functions
const { addUserToGame } = require("./games/add-user-to-game");
const { createGame } = require("./games/create-game");
const { getAvailableGames } = require("./games/get-available-games");
const { getCardInfo } = require("./games/get-card-info");
const { getFaceUpCard } = require("./games/get-face-up-card");
const { getGameDirection } = require("./games/get-game-direction");
const { getGameInfo } = require("./games/get-game-info");
const { getGameSocket } = require("./games/get-game-socket");
const { getHandOfPlayer } = require("./games/get-hand-of-player");
const { getPlayerBySeat } = require("./games/get-player-by-seat");
const { getRandomCard } = require("./games/get-random-card");
const { getUserCount } = require("./games/get-user-count");
const { getUsersInGame } = require("./games/get-users-in-game");
const { getCurrentSeat } = require("./games/get-current-seat");
const { setCurrentPlayer } = require("./games/set-current-player");
const { setGameCard } = require("./games/set-game-card");
const { setGameDirection } = require("./games/set-game-direction");

// Helper Functions
const { createShuffledDeck } = require("./games/create-shuffled-deck");
const { dealStartingCards } = require("./games/deal-starting-cards");
const { setGameInitialized } = require("./games/set-game-initialized");

const initializeGame = async (gameId) => {
  await setGameInitialized(gameId);
  await createShuffledDeck(gameId);
  await dealStartingCards(gameId);

  let faceUpCard = await getRandomCard(gameId);  
  let cardInfo = await getCardInfo(faceUpCard.card_id);
  
  while(cardInfo.modifier !== 'none'){
    faceUpCard = await getRandomCard(gameId);  
    cardInfo = await getCardInfo(faceUpCard.card_id);
  }

  await setGameCard(-1, faceUpCard.card_id, gameId);

  const firstPlayer = await getPlayerBySeat(1, gameId);
  await setCurrentPlayer(firstPlayer.user_id, gameId);

  console.log("Initialized game " + gameId);
}

module.exports = {
  addUserToGame,
  createGame,
  getFaceUpCard,
  getAvailableGames,
  getCardInfo,
  getGameDirection,
  getGameInfo,
  getGameSocket,
  getHandOfPlayer,
  getPlayerBySeat,
  getRandomCard,
  getUserCount,
  getUsersInGame,
  getCurrentSeat,
  initializeGame,
  setCurrentPlayer,
  setGameCard,
  setGameDirection,
}