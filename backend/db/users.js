const { connection: db } = require("./connection");

const USERS_EXISTENCE = "SELECT email FROM users WHERE email=$1;";
const ADD_USER = "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id;";
const SIGN_USER_IN = "SELECT * FROM users WHERE email=$1;";
const GET_USER_SOCKET = "SELECT sid FROM session WHERE sess->'user'->>'id'='$1' ORDER BY expire DESC LIMIT 1;";

const email_exists = (email) => 
  db
    .one(USERS_EXISTENCE, [email])
    .then(_ => true)
    .catch(_ => false);

const create = (email, username, password) => db.one(ADD_USER, [email, username, password]);

const find_by_email = (email) => db.one(SIGN_USER_IN, [email]);

const getUserSocket = (userId) => db.one(GET_USER_SOCKET, [userId]);

module.exports = {
  email_exists,
  create,
  find_by_email,
  getUserSocket
};