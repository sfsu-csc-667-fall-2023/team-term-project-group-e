import gameSocketConfig from "./game_socket";
import userSocketConfig from "./user_socket";

const gameSocketId = document.querySelector("#game-socket-id").value;
const userSocketId = document.querySelector("#user-socket-id").value;

gameSocketConfig(gameSocketId);
userSocketConfig(userSocketId);

document.querySelector("#start-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const { action, method } = event.target.attributes;
  fetch(action.value, { method: method.value });
  return false;
});