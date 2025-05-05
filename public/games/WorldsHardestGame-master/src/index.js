(function() {
  "use strict";

  var controller, display, game;

  controller = {
    down: false,
    left: false,
    right: false,
    up: false,

    keyUpDown: function(event) {
      var key_state = event.type == "keydown" ? true : false;

      switch (event.keyCode) {
        case 65:
          controller.left = key_state;
          break; // left key
        case 87:
          controller.up = key_state;
          break; // up key
        case 68:
          controller.right = key_state;
          break; // right key
        case 83:
          controller.down = key_state;
          break; // down key
      }
    }
  };
  const tileValColor = (val, index) => {
    if (val === '0') {
      return (index + (index % (game.world.columns * 2) < game.world.columns ? 1 : 0) )% 2 === 0 ? "#e6e6ff": "#fff";
    }
    if (val === "b") {
      return "#94F191"
    }
    return "#b4b5fe" ;
  };
  display = {
    buffer: document.createElement("canvas").getContext("2d"),
    context: document.querySelector("canvas").getContext("2d"),
    output: document.querySelector("p"),

    render: function() {
      for (let index = game.world.map.length - 1; index > -1; --index) {
        this.buffer.fillStyle = tileValColor(game.world.map[index], index);
        this.buffer.fillRect(
          (index % game.world.columns) * game.world.tile_size,
          Math.floor(index / game.world.columns) * game.world.tile_size,
          game.world.tile_size,
          game.world.tile_size
        );
      }

      this.buffer.fillStyle = game.player.color;
      this.buffer.fillRect(
        game.player.x,
        game.player.y,
        game.player.width,
        game.player.height
      );
      this.buffer.strokeStyle = "#aa0000"
      this.buffer.strokeRect(
        game.player.x,
        game.player.y,
        game.player.width,
        game.player.height
      );

      this.context.drawImage(
        this.buffer.canvas,
        0,
        0,
        this.buffer.canvas.width,
        this.buffer.canvas.height,
        0,
        0,
        this.context.canvas.width,
        this.context.canvas.height
      );
    },

    resize: function(event) {
      var client_height = document.documentElement.clientHeight;

      display.context.canvas.width = document.documentElement.clientWidth - 32;

      if (display.context.canvas.width > client_height) {
        display.context.canvas.width = client_height;
      }

      display.context.canvas.height = Math.floor(
        display.context.canvas.width * 0.625
      );

      display.render();
    }
  };
  const playerSize = 23;
  game = {
    /* This is the player object. Make sure to note that for this collision method
    to work, you must record the current and last positions of your game objects
    to use in collision detection. It is used to calculate the vector used to determine
    if an object is entering into a collision tile and from what side. */
    player: {
      color: "#f00",
      stroke: "#000",
      height: playerSize,
      old_x: 160, // these are what you should take note of. Don't worry, it's useful
      old_y: 160, // to keep track of old positions for many physics methods. These aren't one trick pony's.
      speed: 1.875,
      velocity_x: 0,
      velocity_y: 0,
      width: playerSize,
      x: 75 - playerSize,
      y: 75 - playerSize,

      // These functions just make it easy to read the collision code
      get bottom() {
        return this.y + this.height;
      },
      get oldBottom() {
        return this.old_y + this.height;
      },
      get left() {
        return this.x;
      }, // kind of pointless, but used
      get oldLeft() {
        return this.old_x;
      }, // to help visualize the collision methods
      get right() {
        return this.x + this.width;
      },
      get oldRight() {
        return this.old_x + this.width;
      },
      get top() {
        return this.y;
      }, // equally pointless as left side calculations
      get oldTop() {
        return this.old_y;
      }
    },

    world: {
      map: []
      // the routing functions below with matching numbers

      // represent these tiles and route their values to
      // the collision methods you might expect based on their names
    },

    /* This object is responsible for getting the collision methods that match
    tile values in the map. It uses what I call routing functions to group reusable
    narrow phase collision methods together to create a variety of different tile
    boundary shapes. You can get the same effect with an array of routing functions rather
    than giving an object's routing functions numeric indexes, if you prefer. It might be faster. */
    collision: {
      // top wall collision tile
      1: function(object, row, column) {
        // The player hits the bottom of ceiling tiles.
        this.bottomCollision(object, row);
      },

      // left wall collision tile
      2: function(object, row, column) {
        this.rightCollision(object, column);
      },

      // right wall collision tile
      3: function(object, row, column) {
        // The player collides with the left side of a wall on the right of the map.
        this.leftCollision(object, column); // Confusing to visualize, but true.
      },

      // bottom wall collision tile
      4: function(object, row, column) {
        this.topCollision(object, row);
      },

      // block tile with four walls
      5: function(object, row, column) {
        /* It makes sense to test the most likely side to be collided with first.
        In a top down game, all sides are hit about the same number of times, depending
        on gameplay, but in a side scroller with downward pulling gravity, the tops of
        tiles will usually get the most traffic, so it makes sense to test the tops
        first in those scenarios. */
        if (this.topCollision(object, row)) {
          return;
        } // Make sure to early out
        if (this.leftCollision(object, column)) {
          return;
        } // if a collision is detected.
        if (this.rightCollision(object, column)) {
          return;
        }
        this.bottomCollision(object, row); // No need to early out on the last check.
      },
      // left and right only
      6: function(object, row, column) {
        if (this.leftCollision(object, column)) {
          return;
        }
        this.rightCollision(object, column);
      },
      // left, right and bottom only
      7: function(object, row, column) {
        if (this.leftCollision(object, column)) {
          return;
        }
        if (this.rightCollision(object, column)) {
          return;
        }
        this.bottomCollision(object, row); // No need to early out on the last check.
      },
      //left right and top only
      8: function(object, row, column) {
        if (this.leftCollision(object, column)) {
          return;
        }
        if (this.rightCollision(object, column)) {
          return;
        }
        this.topCollision(object, row); // No need to early out on the last check.
      },
      //left and top
      9: function(object, row, column) {
        if (this.leftCollision(object, column)) {
          return;
        }
        this.topCollision(object, row); // No need to early out on the last check.
      },
      //bottom and right
      a: function(object, row, column) {
        if (this.rightCollision(object, column)) {
          return;
        }
        this.bottomCollision(object, row); // No need to early out on the last check.
      },
      b: (a,b,c) => {return; },

      /* Here are the narrow phase collision detection and response functions.
      For a deeper insight into how these work, and what's going on, I'm using
      leftCollision as an example. The principles I explain here apply to all
      of the other narrow phase collision methods. Note that they're basically
      doing the same thing, just for different flat sides of a tile. */
      leftCollision(object, column) {
        /* To calculate the player's movement vector, I'm no longer using its velocity (like in the last tutorial).
        Instead, I'm going to calculate it based on it's current and last positions.
        the old way was if (object.velocity_x > 0), now it's if (object.x - object.old_x > 0).
        This is a bit more reliable in my opinion, depending on how and when you calculate your velocity. */

        /* If the object is not moving right, how will it ENTER into the left side of a tile?
        If not moving right, the player can't possibly ENTER the left side of a tile.
        We are only concerned with resolving collisions objects ENTER into. If they are spawned
        inside a collision tile, it is not the collision manager's job to resolve that, it is
        the level designer's job to fix the level design so collision can be as efficient as possible. */
        if (object.x - object.old_x > 0) {
          // the left side of the specified tile column
          var left = column * game.world.tile_size;

          /* This tests to see if our object is ENTERING through the collision boundary
          along the correct movement vector. If its current position is past the boundary
          and its old position is before the boundary, we know that it has entered into collision with the tile. */
          if (object.right > left && object.oldRight <= left) {
            object.velocity_x = 0;
            object.x = object.old_x = left - object.width - 0.001;
            /* You really don't need to reset the player's old position here if you are
            setting it at the start of each game loop, but if you are using a fixed time step
            game loop with interpolation, it will make your collisions look more pixel perfect.
            The reason for this is because with interpolation, your player may be drawn slightly
            away from the wall he just collided with on the next frame of animation depending on
            how much time has passed. So, you don't need to do this, but it doesn't hurt. It may
            be a problem if you end up changing old positions for player to player collisions as well,
            however, because old positions are used to calculate vectors for tile collision.
            Just make sure changing old positions are the last thing you do before the next frame,
            and you should be fine. */

            return true;
          }
        }

        return false;
      },

      rightCollision(object, column) {
        if (object.x - object.old_x < 0) {
          // the right side of the specified tile column
          var right = (column + 1) * game.world.tile_size;

          if (object.left < right && object.oldLeft >= right) {
            object.velocity_x = 0;
            object.old_x = object.x = right;

            return true;
          }
        }

        return false;
      },

      bottomCollision(object, row) {
        // if the object is moving up
        if (object.y - object.old_y < 0) {
          var bottom = (row + 1) * game.world.tile_size;

          if (object.top < bottom && object.oldTop >= bottom) {
            object.velocity_y = 0;
            object.old_y = object.y = bottom;
          }
        }
      },

      topCollision(object, row) {
        // if the object is moving down
        if (object.y - object.old_y > 0) {
          // the top side of the specified tile row
          var top = row * game.world.tile_size;

          // if the object has passed through the tile boundary since the last game cycle
          if (object.bottom > top && object.oldBottom <= top) {
            object.velocity_y = 0;
            object.old_y = object.y = top - object.height - 0.01;

            return true;
          }
        }

        return false;
      }
    },

    // The game loop:
    loop: function() {
      // Get controller input and move that player object!
      if (controller.down) {
        game.player.velocity_y += game.player.speed;
      }

      if (controller.up) {
        game.player.velocity_y -= game.player.speed;
      }

      if (controller.left) {
        game.player.velocity_x -= game.player.speed;
      }

      if (controller.right) {
        game.player.velocity_x += game.player.speed;
      }

      // Update the player object:
      game.player.old_x = game.player.x; // Set the old position to the current position
      game.player.old_y = game.player.y; // before we update the current position, thus making it current

      game.player.x += game.player.velocity_x; // Update the current position
      game.player.y += game.player.velocity_y;

      // Do collision detection and response with the boundaries of the screen.
      // if (game.player.x < 0) {
      //   game.player.velocity_x = 0;
      //   game.player.old_x = game.player.x = 0;
      // } else if (
      //   game.player.x + game.player.width >
      //   display.buffer.canvas.width
      // ) {
      //   game.player.velocity_x = 0;
      //   game.player.old_x = game.player.x =
      //     display.buffer.canvas.width - game.player.width - 0.001;
      //   /* I added that - 0.001 to the equation to really push the player object back into
      //   the game world. If the edge of the world is 320 px, and you set the right edge of
      //   the player obect to 320, technically its tile position will be 1 tile to the right of
      //   the edge of the world when calculated. Say there are 10 columns in the map, and each
      //   tile is 32 pixels wide. 320/32 is 10, but since our map index starts at 0, a value of 10
      //   falls outside of the map's number of columns. Failing to handle this can result in
      //   testing collision on tiles in another row, or tiles at undefined positions in the map array.*/
      // }

      if (game.player.y < 0) {
        game.player.velocity_y = 0;
        game.player.old_y = game.player.y = 0;
      } else if (
        game.player.y + game.player.height >
        display.buffer.canvas.height
      ) {
        game.player.velocity_y = 0;
        game.player.old_y = game.player.y =
          display.buffer.canvas.height - game.player.height - 0.001;
      }

      /* Here is where we do broadphase collision detection with the four corners of
      our player object. This is very important. In the last tutorial the player only
      had 1 collision registration point. Collision was simple, then. Now, it's just as
      simple, but we need to do it for each corner of our player object. */

      /* Once again, there's no point of testing collision if we're not moving. depending
      on which direction we are moving we must test different collision registration points
      on our player. For instance, if he is moving left, we test the points on his left side: */
      if (game.player.x - game.player.old_x < 0) {
        // test collision on left side of player if moving left

        /* There are much more efficient ways to write this code without repeating
        variable names and this big monsterous block of if statements, but I thought it
        would be good to have specific variable names and less abstraction so you can
        get an idea of what's going on. */
        var left_column = Math.floor(game.player.left / game.world.tile_size);
        var bottom_row = Math.floor(game.player.bottom / game.world.tile_size);
        var value_at_index =
          game.world.map[bottom_row * game.world.columns + left_column];

        if (value_at_index != 0) {
          // Check the bottom left point

          game.collision[value_at_index](game.player, bottom_row, left_column);
          display.output.innerHTML =
            "last tile collided with: " + value_at_index;
        }

        var top_row = Math.floor(game.player.top / game.world.tile_size);
        value_at_index =
          game.world.map[top_row * game.world.columns + left_column];

        if (value_at_index != 0) {
          // Check the top left point

          game.collision[value_at_index](game.player, top_row, left_column);
          display.output.innerHTML =
            "last tile collided with: " + value_at_index;
        }
      } else if (game.player.x - game.player.old_x > 0) {
        // Is the player moving right?

        var right_column = Math.floor(game.player.right / game.world.tile_size);
        var bottom_row = Math.floor(game.player.bottom / game.world.tile_size);
        var value_at_index =
          game.world.map[bottom_row * game.world.columns + right_column];

        if (value_at_index != 0) {
          // Check the bottom right point

          game.collision[value_at_index](game.player, bottom_row, right_column);
          display.output.innerHTML =
            "last tile collided with: " + value_at_index;
        }

        var top_row = Math.floor(game.player.top / game.world.tile_size);
        value_at_index =
          game.world.map[top_row * game.world.columns + right_column];

        if (value_at_index != 0) {
          // Check the top right point

          game.collision[value_at_index](game.player, top_row, right_column);
          display.output.innerHTML =
            "last tile collided with: " + value_at_index;
        }
      }

      if (game.player.y - game.player.old_y < 0) {
        var left_column = Math.floor(game.player.left / game.world.tile_size);
        var top_row = Math.floor(game.player.top / game.world.tile_size);
        var value_at_index =
          game.world.map[top_row * game.world.columns + left_column];

        if (value_at_index != 0) {
          // Check the top left point

          game.collision[value_at_index](game.player, top_row, left_column);
          display.output.innerHTML =
            "last tile collided with: " + value_at_index;
        }

        var right_column = Math.floor(game.player.right / game.world.tile_size);
        value_at_index =
          game.world.map[top_row * game.world.columns + right_column];

        if (value_at_index != 0) {
          // Check the top right point

          game.collision[value_at_index](game.player, top_row, right_column);
          display.output.innerHTML =
            "last tile collided with: " + value_at_index;
        }
      } else if (game.player.y - game.player.old_y > 0) {
        var left_column = Math.floor(game.player.left / game.world.tile_size);
        var bottom_row = Math.floor(game.player.bottom / game.world.tile_size);
        var value_at_index =
          game.world.map[bottom_row * game.world.columns + left_column];

        if (value_at_index != 0) {
          // Check the bottom left point

          game.collision[value_at_index](game.player, bottom_row, left_column);
          display.output.innerHTML =
            "last tile collided with: " + value_at_index;
        }

        var right_column = Math.floor(game.player.right / game.world.tile_size);
        value_at_index =
          game.world.map[bottom_row * game.world.columns + right_column];

        if (value_at_index != 0) {
          // Check the bottom right point

          game.collision[value_at_index](game.player, bottom_row, right_column);
          display.output.innerHTML =
            "last tile collided with: " + value_at_index;
        }
      }

      game.player.velocity_x = 0;
      game.player.velocity_y = 0;

      display.render();

      window.requestAnimationFrame(game.loop);
    }
  };

  display.buffer.canvas.height = 450;
  display.buffer.canvas.width = 800;

  window.addEventListener("resize", display.resize);
  window.addEventListener("keydown", controller.keyUpDown);
  window.addEventListener("keyup", controller.keyUpDown);

  display.resize();
  // 1s are ceiling tiles
  // 2s and 3s are right and left wall tiles
  // 5 is a solid block/box tile
  // 4 is a floor tile
  const mapStr = `
111111111111111111
2bbb3111111a00bbb3
2bbb6000000008bbb3
2bbb6000000006bbb3
2bbb6000000006bbb3
2bbb6000000006bbb3
2bbb7000000006bbb3
2bbb0094444442bbb3
144444111111114441
`;
  display.buffer.lineWidth = 3;
  const map = mapStr
    .slice(1, -1)
    .replace(/\n/g, "")
    .split("");
  game.world = Object.assign(game.world, {
    columns: mapStr.split("\n")[1].length,
    rows: 5,
    tile_size: 34.17,
    map
  });
  game.loop();
})();
