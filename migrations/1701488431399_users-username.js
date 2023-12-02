/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumns('users', {
    username: {
      type: "varchar(256)",
      notNull: true,
      unique: true,
    }
  });
};

exports.down = pgm => {
  pgm.removeColumn("users", {
    username
  });
};
