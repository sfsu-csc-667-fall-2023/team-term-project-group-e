// need to send the card objects to this function
const canPlayCard = (card1, card2) => {
  if(card1.color === 'none'){
    return true;
  } else if(card1.modifier === 'none') {
    if(card1.color === card2.color || card1.value === card2.value){
      return true;
    } 
  } else {
    if(card1.color === card2.color){
      return true;
    }
  }

  return false;
}

module.exports = { canPlayCard };