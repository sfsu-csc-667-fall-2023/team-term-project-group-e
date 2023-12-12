import gameSocketConfig from "./game_socket";
import userSocketConfig from "./user_socket";

const gameSocketId = document.querySelector("#game-socket-id").value;
const userSocketId = document.querySelector("#user-socket-id").value;

gameSocketConfig(gameSocketId);
userSocketConfig(userSocketId);

document.querySelector("#start-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const { action, method } = event.target.attributes;
  fetch(action.value, { method: method.value });
  return false;
});

document.addEventListener('DOMContentLoaded', () => {
  const playerCards = document.getElementById("player-cards");
  playerCards.addEventListener('submit', (event) => {
    if(event.target.tagName.toLowerCase() === 'form'){
      event.preventDefault();
      const form = event.target;
      const { action, method } = form.attributes;
      const card_id = form.card_id.value;
      const color = form.color.value;
      fetch(action.value, { 
        method: method.value, 
        headers: {
          'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({card_id, color})
      });
      return false;
    }
  });
});