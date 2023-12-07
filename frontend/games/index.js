import { io } from "socket.io-client";
import { configure as gameSocketConfig } from "./game_socket";

const gameSocketId = document.querySelector("#game-socket-id").value;
// const userSocketId = document.querySelector("#user-socket-id").value;

const gameSocket = io({ query: { gameSocketId }});
// const userSocket = io({ query: { userSocketId }});

gameSocketConfig(gameSocket);