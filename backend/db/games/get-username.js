const {connection: db} = require("../connection");

const GET_USERNAME = "SELECT username FROM users WHERE id=$1";

const getUsername = (userId) => db.one(GET_USERNAME, [userId]);

module.exports = { getUsername };