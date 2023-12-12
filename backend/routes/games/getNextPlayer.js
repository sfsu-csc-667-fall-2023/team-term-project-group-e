const { Games } = require("../../db");

// Function to update the database to set the next active player.
const getNextPlayer = async (gameId) => {
  const currentPlayer = await Games.getCurrentSeat(gameId);
  const currentSeat = await Games.getSeatByPlayer(currentPlayer.current_seat, gameId);
  const userCount = await Games.getUserCount(gameId);
  let nextPlayer;

  const direction = await Games.getGameDirection(gameId);
  if(direction.direction === 'forward'){
    if(currentSeat.seat === userCount){
      nextPlayer = await Games.getPlayerBySeat(1, gameId);
    } else {
      nextPlayer = await Games.getPlayerBySeat(currentSeat.seat+1, gameId);
    }
  } else {
    if(currentSeat.seat === 1){
      nextPlayer = await Games.getPlayerBySeat(userCount, gameId);
    } else {
      nextPlayer = await Games.getPlayerBySeat(currentSeat.seat-1, gameId);
    }
  }

  return nextPlayer;
}

module.exports = { getNextPlayer };