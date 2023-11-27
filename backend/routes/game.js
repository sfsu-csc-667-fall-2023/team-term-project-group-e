const crypto = require("crypto");
const express = require("express");
const router = express.Router();

const { games } = require("../db");

router.get("/create", async (request, response) => {
  const {id: userId} = request.session.user;
  const io = request.app.get("io");
  
  const { id: gameId } = await games.create(
    crypto.randomBytes(20).toString('hex')
  );
  await games.addUser(userId, gameId);

  io.emit("game:created", { id: gameId });

  response.redirect(`/game/${gameId}`);
})

router.get("/:id/join", async (request, response) => {
  const {id: gameId} = request.params;
  const {id: userId, email: userEmail} = request.session.user;
  const io = request.app.get("io");
  
  await games.addUser(userId, gameId);
  io.emit("game:user_added", {userId, userEmail, gameId});

  response.redirect(`/game/${gameId}`);
  
});

router.get("/:id", async (request, response) => {
  const { id } = request.params;
  const {game_socket_id: gameSocketId} = await games.getGame(id);

  response.render("game", { id, gameSocketId });
});

module.exports = router;