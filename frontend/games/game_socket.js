import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "../../constants/game";

let gameSocket;

const gameSocketConfig = (socketId) => {
  gameSocket = io({ query: { id: socketId } });

  gameSocket.on(GAME_CONSTANTS.READY, data => {
    // add start butten when player count > 2 so that game can start when host presses it
    console.log({ event: GAME_CONSTANTS.READY, data});
    const start = document.querySelector("#start-form");
    start.style.setProperty("display", "block");
  });

  gameSocket.on(GAME_CONSTANTS.START, data => {
    // remove the start button
    console.log({ event: GAME_CONSTANTS.START, data});
    const start = document.querySelector("#start-form");
    start.style.setProperty("display", "none");
  });

  gameSocket.on(GAME_CONSTANTS.USER_ADDED, data => {
    // update game log to communicate who was added to the game.
    console.log({ event: GAME_CONSTANTS.USER_ADDED, data});
  });

  gameSocket.on(GAME_CONSTANTS.GAME_INFO, data => {
    // update the game board to show each player's username and the number of cards they have
    console.log({ event: GAME_CONSTANTS.GAME_INFO, data});
    const usersContainer = document.getElementById("opponents");
    usersContainer.innerHTML = '';
    for(const player of data.gameInfo){
      const template = document.querySelector("#opponent-template").content.cloneNode(true);
      const p1 = template.querySelector("#username");
      const p2 = template.querySelector("#card-count");
      p1.innerText = player.username;
      p2.innerText = "Cards: " + player.count;
      usersContainer.appendChild(template);
    }
  });

  gameSocket.on(GAME_CONSTANTS.USER_CURRENT, data => {
    // update the game log to communicate whose turn it is
    console.log({ event: GAME_CONSTANTS.USER_CURRENT, data });
    const p = document.createElement("p");
    p.innerText = "It is " + data.currentPlayer.username + "'s turn.";
    const log = document.getElementById("message-log");
    log.appendChild(p);
  });

  gameSocket.on(GAME_CONSTANTS.FACE_UP_CARD, data => {
    // update the game board to showcase the current face up card
    console.log({ event: GAME_CONSTANTS.FACE_UP_CARD, data});

    const currentBoard = document.getElementById("current-card");
    currentBoard.innerHTML = '';

    const template = document.querySelector("#board-card-template").content.cloneNode(true);
    const p = template.querySelector("p");
    const currentCard = document.querySelector("#current-card");
    if(data.faceUpCard.modifier === 'none'){
      p.innerText = data.faceUpCard.color + " " + data.faceUpCard.value;
    } else if (data.faceUpCard.color === 'none'){
      p.innerText = data.faceUpColor.current_color;
    } else {
      p.innerText = data.faceUpCard.color + " " + data.faceUpCard.modifier;
    }
    currentCard.appendChild(template);

  })

  gameSocket.on(GAME_CONSTANTS.WINNER, data => {
    console.log({ event: GAME_CONSTANTS.WINNER, data});
    const handContainer = document.querySelector("#player-cards");
    handContainer.innerHTML = '';
    const usersContainer = document.getElementById("opponents");
    usersContainer.innerHTML = '';
    const currentBoard = document.getElementById("current-card");
    currentBoard.innerHTML = '';
    const p = document.createElement("p");
    p.innerText = data.winner.username + " wins!";
    currentBoard.appendChild(p);

  });

}

export default gameSocketConfig;