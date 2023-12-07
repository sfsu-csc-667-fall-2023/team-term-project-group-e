import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "../../constants/game";

let userSocket;

const userSocketConfig = (socketId) => {
  userSocket = io({ query: { id: socketId }});

  userSocket.on("user:hand", data => {
    console.log({ data });
  })
}

export default userSocketConfig;