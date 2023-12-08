const express = require("express");
const router = express.Router();

const { create } = require("./games/create");
const { start } = require("./games/start");
const { join } = require("./games/join");
const { id } = require("./games/id");

router.get("/create", (request, response) => create(request, response));

router.post("/:id/start",  (request, response) => start(request, response));

router.get("/:id/join", (request, response) => join(request, response));

router.get("/:id", async (request, response) => id(request, response));

module.exports = router;