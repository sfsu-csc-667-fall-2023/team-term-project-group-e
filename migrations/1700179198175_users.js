/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm 
 */
exports.up = pgm => {
  pgm.createTable("users", {
    id: "id",
    email: {
      type: "varchar(256)",
      notNull: true,
      unique: true,
    }, 
    password: {
      type: "char(60)",
      notNull: true,
    },
    created_at: {
      type: "timestamp", 
      notNull: true,
      default: pgm.func("current_timestamp"),
    }

  });
};

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm 
 */
exports.down = pgm => {
  pgm.dropTable("users");
};
