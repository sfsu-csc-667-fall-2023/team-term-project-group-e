/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm 
 */
exports.up = pgm => {
  pgm.createTable("cards", {
    id: "id",
    value: {
      type: "int",
    },
    color: {
      type: "varchar",
    }, 
    modifier: {
      type: "varchar",
    }
  });

  // adding cards according to https://www.unorules.org/how-many-cards-in-uno/
  let sql = "INSERT INTO cards (value, color, modifier) VALUES";
  const values = []
  const colors = ["red", "yellow", "green", "blue"];
  const modifiers = ["skip", "add_2", "reverse", "change_color", "change_color_add_4"];
  
  // Number cards
  for(let value = 0; value <= 9; value++){
    for(let color = 0; color < 4; color++){
      values.push(`(${value}, '${colors[color]}', 'none')`);
    }
  }
  for(let value = 1; value <= 9; value++){
    for(let color = 0; color < 4; color++){
      values.push(`(${value}, '${colors[color]}', 'none')`);
    }
  }
  
  // Modifier cards
  for(let i = 0; i < 2; i++){
    for(let modifier = 0; modifier < 3; modifier++){
      for(let color = 0; color < 4; color++){
        values.push(`(0, '${colors[color]}', '${modifiers[modifier]}')`);
      }
    }
  }

  // Change_color cards
  for(let modifier = 3; modifier <= 4; modifier++){
    for(let i = 0; i < 4; i++){
      values.push(`(0, 'none', '${modifiers[modifier]}')`);
    }
  }

  const query = `${sql} ${values.join(",")}`;

  pgm.sql(query);
  
};

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm 
 */
exports.down = pgm => {
  pgm.dropTable("cards");
};
