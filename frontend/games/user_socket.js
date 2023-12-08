import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "../../constants/game";

let userSocket;
// const gameId = document.querySelector("#game-id").value;

const userSocketConfig = (socketId) => {
  userSocket = io({ query: { id: socketId }});

  userSocket.on("user:hand", data => {
    console.log({ event: "user:hand", data });
  })
}

export default userSocketConfig;