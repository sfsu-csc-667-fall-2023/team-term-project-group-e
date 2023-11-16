const express = require("express");
const router = express.Router();

router.get("/", (_request, response) => {
  response.render("sign_up");
});

module.exports = router;