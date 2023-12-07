const crypto = require("crypto");
const express = require("express");
const router = express.Router();

const { games, users } = require("../db");
const GAME_CONSTANTS = require("../../constants/game");

router.get("/create", async (request, response) => {
  const {id: userId} = request.session.user;
  const io = request.app.get("io");
  
  const { id: gameId } = await games.create(
    crypto.randomBytes(20).toString('hex')
  );
  await games.addUser(userId, gameId);

  io.emit(GAME_CONSTANTS.CREATED, { id: gameId });

  response.redirect(`/game/${gameId}`);
})

router.post("/start", async (request, response) => {
  console.log("Game started!");
  const io = request.app.get("io");

  io.emit(GAME_CONSTANTS.START, {});

  response.status(200).send();
})

router.get("/:id/join", async (request, response) => {
  const {id: gameId} = request.params;
  const {id: userId, email: userEmail} = request.session.user;

  const { game_socket_id: gameSocketId } = await games.getGame(gameId);

  const io = request.app.get("io");
  
  await games.addUser(userId, gameId);

  io.emit(GAME_CONSTANTS.USER_ADDED, {userId, userEmail, gameId});

  const userCount = await games.userCount(gameId);

  if(userCount > 1){
    // const gameState = await games.initialize(gameId);
    io.emit(GAME_CONSTANTS.READY, {});
  }

  response.redirect(`/game/${gameId}`);
  
});

router.get("/:id", async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId } = request.session.user; 
  const { game_socket_id: gameSocketId } = await games.getGame(gameId);
  const { sid: userSocketId } = await users.getUserSocket(userId);

  response.render("game", { gameId, gameSocketId, userSocketId });
});

module.exports = router;