const { Games } = require("../../db");

const checkWinState = async (gameId) => {
  const players = await Games.getUsersInGame(gameId);
  for (const id of players){
    const count = await Games.getCountOfHand(id.user_id, gameId);
    if(parseInt(count.count) === 0){
      return id.user_id;
    }
  }

  return -1;
}

module.exports = { checkWinState };