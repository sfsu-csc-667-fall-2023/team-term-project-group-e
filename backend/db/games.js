// Exported Functions
const { addUserToGame } = require("./games/add-user-to-game");
const { createGame } = require("./games/create-game");
const { getAvailableGames } = require("./games/get-available-games");
const { getCardInfo } = require("./games/get-card-info");
const { getCountOfHand } = require("./games/get-count-of-hand");
const { getCurrentColor } = require("./games/get-current-color");
const { getFaceUpCard } = require("./games/get-face-up-card");
const { getGameDirection } = require("./games/get-game-direction");
const { getGameInfo } = require("./games/get-game-info");
const { getGameSocket } = require("./games/get-game-socket");
const { getHandOfPlayer } = require("./games/get-hand-of-player");
const { getPlayerBySeat } = require("./games/get-player-by-seat");
const { getRandomCard } = require("./games/get-random-card");
const { getSeatByPlayer } = require("./games/get-seat-by-player");
const { getUserCount } = require("./games/get-user-count");
const { getUsersInGame } = require("./games/get-users-in-game");
const { setCurrentColor } = require("./games/set-current-color");
const { getCurrentSeat } = require("./games/get-current-seat");
const { setCurrentPlayer } = require("./games/set-current-player");
const { setGameCard } = require("./games/set-game-card");
const { setGameDirection } = require("./games/set-game-direction");
const { getUsername } = require("./games/get-username");

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
  await setCurrentColor(cardInfo.color, gameId);

  const firstPlayer = await getPlayerBySeat(1, gameId);
  await setCurrentPlayer(firstPlayer.user_id, gameId);

}

module.exports = {
  addUserToGame,
  createGame,
  getFaceUpCard,
  getAvailableGames,
  getCardInfo,
  getCountOfHand,
  getCurrentColor,
  getGameDirection,
  getGameInfo,
  getGameSocket,
  getHandOfPlayer,
  getPlayerBySeat,
  getRandomCard,
  getSeatByPlayer,
  getUserCount,
  getUsersInGame,
  getCurrentSeat,
  initializeGame,
  setCurrentColor,
  setCurrentPlayer,
  setGameCard,
  setGameDirection,
  getUsername,
}