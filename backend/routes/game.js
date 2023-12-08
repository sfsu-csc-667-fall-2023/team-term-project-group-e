const crypto = require("crypto");
const express = require("express");
const router = express.Router();

const { Games, Users } = require("../db");
const GAME_CONSTANTS = require("../../constants/game");

router.get("/create", async (request, response) => {
  const {id: userId} = request.session.user;
  const io = request.app.get("io");
  
  const { id: gameId } = await Games.create(
    crypto.randomBytes(20).toString('hex')
  );
  await Games.addUser(userId, gameId);

  io.emit(GAME_CONSTANTS.CREATED, { id: gameId });

  response.redirect(`/game/${gameId}`);
})

router.post("/:id/start", async (request, response) => {
  console.log("Game started!");

  const { id: gameId } = request.params;

  await Games.initialize(gameId);

  const io = request.app.get("io");

  io.emit(GAME_CONSTANTS.START, {});

  const players = await Games.getUsersInGame(gameId);

  // await Promise.all(players.map(async (player) => {
  //   const { sid: userSocketId } = await Users.getUserSocket(parseInt(player.user_id));
  //   const hand = await Games.getHandOfPlayer(parseInt(player.user_id), gameId); 
  //   console.log({ hand });
  //   io.to(userSocketId).emit("user:hand", { hand });
  // }));

  // for(const player of players){
  //   const { sid: userSocketId } = await Users.getUserSocket(parseInt(player.user_id));
  //   const hand = await Games.getHandOfPlayer(parseInt(player.user_id), gameId); 

  //   io.to(userSocketId).emit("user:hand", { hand });
  // }

  response.status(200).send();
})

router.get("/:id/join", async (request, response) => {
  const {id: gameId} = request.params;
  const {id: userId, email: userEmail} = request.session.user;

  const io = request.app.get("io");
  
  await Games.addUser(userId, gameId);

  io.emit(GAME_CONSTANTS.USER_ADDED, {userId, userEmail, gameId});

  const userCount = await Games.userCount(gameId);

  if(userCount > 1){
    // const gameState = await games.initialize(gameId);
    io.emit(GAME_CONSTANTS.READY, {});
  }

  response.redirect(`/game/${gameId}`);
  
});

router.get("/:id", async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId } = request.session.user; 
  const { game_socket_id: gameSocketId } = await Games.getGame(gameId);
  const { sid: userSocketId } = await Users.getUserSocket(userId);

  response.render("game", { gameId, gameSocketId, userSocketId });
});

module.exports = router;