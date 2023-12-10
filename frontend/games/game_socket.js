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
  });

  gameSocket.on(GAME_CONSTANTS.USER_CURRENT, data => {
    // update the game log to communicate whose turn it is
    console.log({ event: GAME_CONSTANTS.USER_CURRENT, data });
  });

  gameSocket.on(GAME_CONSTANTS.FACE_UP_CARD, data => {
    // update the game board to showcase the current face up card
    console.log({ event: GAME_CONSTANTS.FACE_UP_CARD, data});
  })

}

export default gameSocketConfig;