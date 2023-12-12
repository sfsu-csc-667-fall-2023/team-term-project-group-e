import { io } from "socket.io-client";
import * as USER_CONSTANTS from "../../constants/user";

let userSocket;

const gameId = document.querySelector("#game-id").value;

const userSocketConfig = (socketId) => {
  userSocket = io({ query: { id: socketId }});

  userSocket.on(USER_CONSTANTS.HAND, data => {
    // update the player's cards to showcase what's in their hand currently
    // change color cards should have 4 buttons: red, green, blue, yellow, and the user clicks the color they want to change the deck to.S
    console.log({ event: USER_CONSTANTS.HAND, data });
    
    const handContainer = document.querySelector("#player-cards");
    handContainer.innerHTML = '';
    for(const card of data.hand){
      const template = document.querySelector("#card-template").content.cloneNode(true);
      const div = template.querySelector("div");
      const p = template.querySelector("p");
      if(card.color !== 'none'){
        if(card.value !== -1){
          p.innerText = card.color + " " + card.value;
        } else {
          p.innerText = card.color + " " + card.modifier;
        }
      } else {
        if(card.modifier === 'change_color'){
          p.innerText = "Change Color";
        } else {
          p.innerText = "Change Color + 4";
        }
      }
      handContainer.appendChild(template);
    }
  })

  userSocket.on(USER_CONSTANTS.CURRENT, data => {
    // update this player's cards to be clickable so that they can play / draw
    console.log({ event: USER_CONSTANTS.CURRENT, data });
  });

  userSocket.on(USER_CONSTANTS.NOT_CURRENT, data => {
    // update this players cards to be all non clickable
    console.log({ event: USER_CONSTANTS.NOT_CURRENT, data }); 
  });

  userSocket.on(USER_CONSTANTS.CANT_PLAY_CARD, data => {
    // communicate to player that they can't play this card
    console.log({ event: USER_CONSTANTS.CANT_PLAY_CARD, data });
  });

  userSocket.on(USER_CONSTANTS.MUST_DRAW_CARD, data => {
    // update player's ui to have a draw button so they can draw a card
    console.log({ event: USER_CONSTANTS.MUST_DRAW_CARD, data });
  });
}

export default userSocketConfig;