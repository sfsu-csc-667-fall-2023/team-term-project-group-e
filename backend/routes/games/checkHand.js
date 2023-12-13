const { Games } = require("../../db");
const { canPlayCard } = require("./canPlayCard");

const checkHand = async (gameId) => {
  const seat = await Games.getCurrentSeat(gameId);
  const hand = await Games.getHandOfPlayer(seat.current_seat, gameId);
  let canPlay = false;
  for(const card of hand){
    if( await canPlayCard(card.card_id, gameId)){
      canPlay= true;
      break;
    }
  }
  return canPlay;
}

module.exports = { checkHand };