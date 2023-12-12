const { Games } = require("../../db");

// need to send the card objects to this function
const canPlayCard = async (cardId, gameId) => {
  const cardInfo = await Games.getCardInfo(cardId);

  if(cardInfo.color === 'none'){
    return true;
  } else {
    const currentColor = await Games.getCurrentColor(gameId);
    const currentCard = await Games.getFaceUpCard(gameId);
    const currentCardInfo = await Games.getCardInfo(currentCard.card_id);

    if(cardInfo.color === currentColor.current_color || cardInfo.value === currentCardInfo.value){
      return true;
    }
  }

  return false;
}

module.exports = { canPlayCard };