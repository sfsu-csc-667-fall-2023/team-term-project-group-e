const express = require("express");
const { games } = require("../db");
const router = express.Router();

router.get("/", async (_request, response) => {

  const availableGames = await games.getAvailableGames();

  response.render("lobby", {availableGames});
});

module.exports = router;
