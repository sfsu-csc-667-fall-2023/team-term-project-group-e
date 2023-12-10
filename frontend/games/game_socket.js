import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "../../constants/game";

let gameSocket;

const gameSocketConfig = (socketId) => {
  gameSocket = io({ query: { id: socketId } });

  gameSocket.on(GAME_CONSTANTS.READY, data => {
    console.log({ event: GAME_CONSTANTS.READY, data});
    const start = document.querySelector("#start-form");
    start.style.setProperty("display", "block");
  });

  gameSocket.on(GAME_CONSTANTS.START, data => {
    console.log({ event: GAME_CONSTANTS.START, data});
    const start = document.querySelector("#start-form");
    start.style.setProperty("display", "none");
  });

  gameSocket.on(GAME_CONSTANTS.USER_ADDED, data => {
    console.log({ event: GAME_CONSTANTS.USER_ADDED, data});
  });

  gameSocket.on(GAME_CONSTANTS.GAME_INFO, data => {
    console.log({ event: GAME_CONSTANTS.GAME_INFO, data});
  });

  gameSocket.on(GAME_CONSTANTS.USER_CURRENT, data => {
    console.log({ event: GAME_CONSTANTS.USER_CURRENT, data });
  });

  gameSocket.on(GAME_CONSTANTS.FACE_UP_CARD, data => {
    console.log({ event: GAME_CONSTANTS.FACE_UP_CARD, data});
  })

}

export default gameSocketConfig;