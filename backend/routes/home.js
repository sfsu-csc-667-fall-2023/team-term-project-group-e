const express = require("express");
const router = express.Router();

router.get("/", (_request, response) => {
  response.render("home", {error: undefined});
});

module.exports = router;
