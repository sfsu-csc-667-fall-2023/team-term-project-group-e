const express = require("express");
const router = express.Router();
const { createHash } = require("crypto");

const handler = (request, response) => {
  const { id } = request.params;
  const { message } = request.body;
  const { email } = request.session.user;

  const io = request.app.get("io");

  io.emit(`chat:message:${id === undefined ? 0 : id}`, {
    from: request.session.user.email, 
    timestamp: Date.now(),
    message,
    hash: createHash('sha256').update(email).digest('hex'),
  });

  response.status(200).send();
}

router.post("/chat", handler);
router.post("/:id/chat", handler);

module.exports = router;