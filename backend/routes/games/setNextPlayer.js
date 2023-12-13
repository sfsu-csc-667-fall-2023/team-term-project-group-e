const { Games } = require("../../db");

const setNextPlayer = async (nextPlayer, gameId) => {
  console.log("Setting ", { nextPlayer}, " as next player");
  await Games.setCurrentPlayer(nextPlayer, gameId);
}

module.exports = { setNextPlayer };