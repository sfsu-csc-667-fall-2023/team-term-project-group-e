const {connection: db} = require("../connection");
const { userCount } = require("./get-user-count");

const ADD_USER = "INSERT INTO game_users (user_id, game_id, seat) VALUES ($1, $2, $3)";

const addUser = (userId, gameId) => 
  userCount(gameId).then(playerCount => 
    db.none(ADD_USER, [userId, gameId, playerCount])
); 

module.exports = { addUser };