const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const SALT_ROUNDS = 10;

const { Users } = require("../db");

router.get("/", (_request, response) => {
  response.render("sign_up");
});

router.post("/register", async (request, response) => {
  const {email, password} = request.body;

  const user_exists = await Users.email_exists(email);
  if(user_exists){
    response.redirect("/");
    return;
  } 

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);

  const { id } = Users.create(email, hash);

  // TODO: Store in session

  response.redirect("/lobby");
});

router.post("/login", async (request, response) => {
  const {email, password} = request.body;

  try {
    const user = await Users.find_by_email(email);
    const isValidUser = await bcrypt.compare(password, user.password);

    if(isValidUser){
      // TODO: Store in session

      response.redirect("/lobby");
      return;
    } else {
      response.render("landing", {error: "The credentials you supplied are invalid."});
      // response.redirect("/");
      return;
    }
  } catch(error) {
    console.log(error);
    response.redirect("/");
  }
  
});


module.exports = router;