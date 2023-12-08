import { io } from "socket.io-client";
import * as USER_CONSTANTS from "../../constants/user";

let userSocket;

const userSocketConfig = (socketId) => {
  userSocket = io({ query: { id: socketId }});

  userSocket.on(USER_CONSTANTS.HAND, data => {
    console.log({ event: "user:hand", data });
  })

  userSocket.on(USER_CONSTANTS.CURRENT, data => {
    console.log("This is the current player.")
  });

  userSocket.on(USER_CONSTANTS.NOT_CURRENT, data => {
    console.log("This is not the current player.");
  })
}

export default userSocketConfig;