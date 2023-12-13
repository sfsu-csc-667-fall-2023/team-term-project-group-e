import { io } from "socket.io-client";
const GAME_CONSTANTS = require("../../constants/game");

const gameEntryTemplate = document.querySelector("#join-game-entry");
const gameList = document.querySelector("#game-list ul");

const socket = io();

socket.on(GAME_CONSTANTS.CREATED, ({ id }) => {
  const entry = gameEntryTemplate.content.cloneNode(true);
  const a = entry.querySelector("a");

  a.href = `/game/${id}/join`;
  a.innerText = `Join ${id}`;

  gameList.appendChild(entry);
});
