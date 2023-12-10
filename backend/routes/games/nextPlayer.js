const { Games } = require("../../db");

// Function to update the database to set the next active player.
const nextPlayer = async (gameId) => {
  const currentSeat = await Games.getCurrentSeat(gameId);
  const userCount = await Games.getUserCount(gameId);
  let nextSeat;

  const direction = await Games.getGameDirection(gameId);
  if(direction === 'forward'){
    if(currentSeat === userCount){
      nextSeat === 1;
    } else {
      nextSeat = currentSeat + 1;
    }
  } else {
    if(currentSeat === 0){
      nextSeat === userCount;
    } else {
      nextSeat = currentSeat - 1;
    }
  }

  const nextPlayer = await Games.getPlayerBySeat(parseInt(nextSeat));
  await Games.setCurrentPlayer(nextPlayer, gameId);
}

module.exports = { nextPlayer };