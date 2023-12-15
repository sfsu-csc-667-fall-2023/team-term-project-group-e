import { io } from "socket.io-client";
import * as USER_CONSTANTS from "../../constants/user";

let userSocket;

const gameId = document.querySelector("#game-id").value;

const userSocketConfig = (socketId) => {
  userSocket = io({ query: { id: socketId } });

  userSocket.on(USER_CONSTANTS.HAND, (data) => {
    // update the player's cards to showcase what's in their hand currently
    // change color cards should have 4 buttons: red, green, blue, yellow, and the user clicks the color they want to change the deck to.S
    console.log({ event: USER_CONSTANTS.HAND, data });

    const handContainer = document.querySelector("#player-cards");
    handContainer.innerHTML = "";

    for (const card of data.hand) {
      let template;
      if (card.color !== "none") {
        template = document
          .querySelector("#card-template")
          .content.cloneNode(true);
        const form = template.querySelector("form");
        const card_id = template.querySelector("#card_id");
        const color = template.querySelector("#color");
        const cardTop = template.querySelector("#card-top");
        const cardCenter = template.querySelector("#card-center");
        const cardBottom = template.querySelector("#card-bottom");
        const cardColor = template.querySelector("#card");

        form.action = `/game/${gameId}/play`;
        if (card.value !== -1) {
          // p.innerText = card.color + " " + card.value;
          cardTop.innerText = card.value;
          cardBottom.innerText = card.value;
          cardCenter.innerText = card.value;
          cardColor.classList.add("card-" + card.color);
          card_id.value = card.id;
          color.value = card.color;
        } else {
          // p.innerText = card.color + " " + card.modifier;
          card_id.value = card.id;
          color.value = card.color;
          cardColor.classList.add("card-" + card.color);
          cardTop.innerText = card.modifier;
          cardBottom.innerText = card.modifier;
          // cardCenter.innerText = card.modifier;
        }
      } else {
        template = document
          .querySelector("#card-template2")
          .content.cloneNode(true);
        const forms = template.querySelectorAll("form");
        const cardTop = template.querySelector("#card-top");
        // const cardCenter = template.querySelector("#card-center");
        const cardBottom = template.querySelector("#card-bottom");
        const cardColor = template.querySelector("#card");

        forms.forEach((form) => {
          const card_id = form.querySelector("#card_id");
          form.action = `/game/${gameId}/play`;
          card_id.value = card.id;
        });
        cardColor.classList.add("card-wild");
        const p = template.querySelector("p");

        if (card.modifier === "change_color") {
          // p.innerText = "Change Color";
          cardTop.innerText = "Wild";
          cardBottom.innerText = "Wild";
          // cardCenter.innerText = "Wild";
        } else {
          // p.innerText = "Change Color + 4";
          cardTop.innerText = "WD +4";
          cardBottom.innerText = "WD +4";
          // cardCenter.innerText = "WD +4";
        }
      }
      handContainer.appendChild(template);
    }
  });

  userSocket.on(USER_CONSTANTS.CURRENT, (data) => {
    // update this player's cards to be clickable so that they can play / draw
    console.log({ event: USER_CONSTANTS.CURRENT, data });
  });

  userSocket.on(USER_CONSTANTS.NOT_CURRENT, (data) => {
    // update this players cards to be all non clickable
    console.log({ event: USER_CONSTANTS.NOT_CURRENT, data });
  });

  userSocket.on(USER_CONSTANTS.CANT_PLAY_CARD, (data) => {
    // communicate to player that they can't play this card
    console.log({ event: USER_CONSTANTS.CANT_PLAY_CARD, data });
    const p = document.createElement("p");
    p.innerText = "[PERSONAL] You can not play this card.";
    const log = document.getElementById("message-log");
    const firstChild = log.firstChild;
    log.insertBefore(p, firstChild);
  });

  userSocket.on(USER_CONSTANTS.MUST_DRAW_CARD, (data) => {
    // update player's ui to have a draw button so they can draw a card
    console.log({ event: USER_CONSTANTS.MUST_DRAW_CARD, data });
    const p = document.createElement("p");
    p.innerText = "[PERSONAL] You must draw a card.";
    const log = document.getElementById("message-log");
    const firstChild = log.firstChild;
    log.insertBefore(p, firstChild);

    const draw = document.querySelector("#draw-form");
    draw.style.setProperty("display", "block");
  });

  userSocket.on(USER_CONSTANTS.REMOVE_DRAW_CARD, (data) => {
    // remove the draw button
    console.log({ event: USER_CONSTANTS.REMOVE_DRAW_CARD, data });
    const draw2 = document.querySelector("#draw-form");
    draw2.style.setProperty("display", "none");
  });
};

export default userSocketConfig;
