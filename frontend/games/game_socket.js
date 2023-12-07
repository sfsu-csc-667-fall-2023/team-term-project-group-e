import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "../../constants/game";

let gameSocket;

const configure = (socketId) => {
  gameSocket = io({ query: { id: socketId }});

  gameSocket.on(GAME_CONSTANTS.READY, data => {
    console.log({ event: GAME_CONSTANTS.READY, data});
    const start = document.querySelector("#start-button-template").content.cloneNode(true);
    const board = document.querySelector("#game-board");

    board.appendChild(start);

  });

  gameSocket.on(GAME_CONSTANTS.START, data => {
    console.log({ event: GAME_CONSTANTS.START, data});
  });

  gameSocket.on(GAME_CONSTANTS.USER_ADDED, data => {
    console.log({ event: GAME_CONSTANTS.USER_ADDED, data});
  });

}

export { configure }