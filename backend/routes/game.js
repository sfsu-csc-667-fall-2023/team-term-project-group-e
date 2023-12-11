const express = require("express");
const router = express.Router();

const { create } = require("./games/create");
const { draw } = require("./games/draw");
const { id } = require("./games/id");
const { join } = require("./games/join");
const { play } = require("./games/play");
const { start } = require("./games/start"); 

router.get("/create", (request, response) => create(request, response));

router.get("/:id/play/:id", (request, response) => play(request, response));

router.get("/:id/draw", (request, response) => draw(request, response));

router.get("/:id/start",  (request, response) => start(request, response));

router.get("/:id/join", (request, response) => join(request, response));

router.get("/:id", (request, response) => id(request, response));

module.exports = router;