const { Games } = require("../../db");

const setNextPlayer = async (nextPlayer, gameId) => {
  await Games.setCurrentPlayer(nextPlayer, gameId);
}

module.exports = { setNextPlayer };