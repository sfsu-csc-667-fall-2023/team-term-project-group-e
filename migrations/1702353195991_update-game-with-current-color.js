/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm 
 */
exports.up = pgm => {
  pgm.addColumn("games", { current_color: {
    type: "varchar"
  }});
};

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm 
 */
exports.down = pgm => {
  pgm.dropColumn("games", "current_color");
};
