const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const SALT_ROUNDS = 10;

const { users } = require("../db");

router.get("/", (_request, response) => {
  response.render("sign_up");
});

router.post("/register", async (request, response) => {
  const {email, username, password} = request.body;

  const user_exists = await users.email_exists(email);
  if(user_exists){
    response.redirect("/");
    return;
  } 

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);

  const { id } = users.create(email, username, hash);

  request.session.user = {
    id, username, email
  }
  response.redirect("/lobby");
});

router.post("/login", async (request, response) => {
  const {email, password} = request.body;

  try {
    const user = await users.find_by_email(email);
    const isValidUser = await bcrypt.compare(password, user.password);

    if(isValidUser){
      request.session.user = {
        id: user.id,
        username: user.username,
        email
      }    
      response.redirect("/lobby");
      return;
    } else {
      response.render("home", {error: "The credentials you supplied are invalid."});
      return;
    }
  } catch(error) {
    console.log(error);
    response.render("home", {error: "The credentials you supplied are invalid."});
  }
});

router.get("/logout", (request, response) => {
  request.session.destroy();
  response.redirect("/");
});


module.exports = router;