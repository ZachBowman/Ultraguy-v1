// Ultraguy
// Nightmare Games 2018
// Zach Bowman

////////////////////////////////////////////////////////////////////////////////

function fadeout () { fade_direction = OUT; }
function fadein () { fade_direction = IN; }
   
////////////////////////////////////////////////////////////////////////////////
 
function fade_control ()
  {
  if (fade_direction === OUT)
    {
    fade_opacity += fade_speed;
    if (fade_opacity >= 1.0)
      {
      fade_opacity = 1.0;
      fadein();

      game_state = transition;
      transition = NONE;          

      if (game_state === GAME && game_active === false) new_game ();
      }
    }
  else if (fade_direction === IN)
    {
    fade_opacity -= fade_speed;
    if (fade_opacity <= 0)
      {
      fade_opacity = 0.0;
      fade_direction = NONE;
      }
    }
  }

////////////////////////////////////////////////////////////////////////////////

function new_game ()  // Start New Game
  {
  player.init();

  map.front = [[Bb,Bb,Bb,_ ,_ ,_ ,Cb,_ ,_ ,_ ,Cb,_ ,_ ,_ ,Sb,Sb,Sb,Sb],
               [Bb,Bb,Bb,_ ,_ ,_ ,Cb,_ ,_ ,_ ,Cb,_ ,_ ,_ ,Sb,Sb,Sb,Sb],
               [Bb,Bb,Bb,_ ,_ ,_ ,Cb,_ ,_ ,_ ,Cb,_ ,_ ,_ ,Sb,Sb,Sb,Sb],
               [Bb,Bb,Bb,_ ,_ ,_ ,I ,I ,I ,I ,I ,_ ,_ ,_ ,Sb,Sb,Sb,Sb],
               [Bb,Bb,Bb,_ ,_ ,_ ,_ ,_ ,_ ,_ ,_ ,_ ,_ ,_ ,Sb,Sb,Sb,Sb],
               [Bb,Bb,Bb,_ ,_ ,_ ,_ ,_ ,_ ,_ ,_ ,_ ,_ ,_ ,Sb,Sb,Sb,Sb],
               [Ds,Ds,Ds,Ds,Ds,G ,G ,G ,G ,G ,G ,G ,Ds,Ds,Ds,Ds,Ds,Ds],
               [Df,Df,Df,Df,Df,Df,Df,Df,Df,Df,Df,Df,Df,Df,Df,Df,Df,Df]];

  map.width = map.front[0].length;
  map.height = map.front.length;

  // create floor tiles
  var tile;
  var horizontal_start = tilesize_x * -2;
  var x = horizontal_start;
  var y = screen_height - tilesize_y;
  for (var my = map.height - 1; my >= 0; my -= 1)
    {
    for (var mx = 0; mx < map.width; mx += 1)
      {
      var m = map.front[my][mx];
      tile = new Tile();
      tile.x = x;
      tile.y = y;
      tile.foreground = true;
      tile.jumpdown = false;

      if (m === B)
        {
        tile.source_x = 0;
        tile.source_y = 0;
        tile_list.push (tile);
        }
      if (m === Bb)
        {
        tile.source_x = 84;
        tile.source_y = 0;
        tile.foreground = false;
        tile_list.push (tile);
        }
      if (m === S)
        {
        tile.source_x = 168;
        tile.source_y = 0;
        tile_list.push (tile);
        }
      if (m === Sb)
        {
        tile.source_x = 252;
        tile.source_y = 0;
        tile.foreground = false;
        tile_list.push (tile);
        }
      if (m === I)
        {
        tile.source_x = 336;
        tile.source_y = 0;
        tile.jumpdown = true;
        tile_list.push (tile);
        }
      if (m === D)
        {
        tile.source_x = 0;
        tile.source_y = 84;
        tile_list.push (tile);
        }
      if (m === Df)
        {
        tile.source_x = 84;
        tile.source_y = 84;
        tile_list.push (tile);
        }
      if (m === Ds)
        {
        tile.source_x = 168;
        tile.source_y = 84;
        tile_list.push (tile);
        }
      if (m === G)
        {
        tile.source_x = 252;
        tile.source_y = 84;
        tile_list.push (tile);
        }
      if (m === Cb)
        {
        tile.source_x = 336;
        tile.source_y = 84;
        tile.foreground = false;
        tile_list.push (tile);
        }

      x += tilesize_x;
      }
    x = horizontal_start;
    y -= tilesize_y;
    }

  badguy = [];
  points = 0;
  display_points = 0;
  reload_showing = false;
  reload_opacity = 0.0;
  game_active = true;

  create_new_badguy();
  update_display_points();

  left_button.init (Sprite ("button_left"), 20, screen_height - 120, null, false);
  right_button.init (Sprite ("button_right"), 120, screen_height - 120, null, false);
  down_button.init (Sprite ("button_down"), screen_width - 300, screen_height - 120, null, false);
  punch_button.init (Sprite ("button_punch"), screen_width - 200, screen_height - 120, null, false);
  jump_button.init (Sprite ("button_jump"), screen_width - 100, screen_height - 120, null, false);
  info_button.init (Sprite ("info_button_white"), screen_width - 60, 20, null, false);

  play_sound ("ultraguy start");

  fadein ();
  }
   
////////////////////////////////////////////////////////////////////////////////

// slow performance
function get_distance (thing1, thing2)
  {
  return Math.sqrt (((thing1.x - thing2.x) * (thing1.x - thing2.x)) + ((thing1.y - thing2.y) * (thing1.y - thing2.y)));
  }

////////////////////////////////////////////////////////////////////////////////

// crappy distance checker, does not slow game down
function close_enough (thing1, thing2, distance)
  {
  if (thing1.x > thing2.x - distance && thing1.x < thing2.x + distance
      && thing1.y - (thing1.box_height / 2) > thing2.y - (thing2.box_height / 2) - distance
      && thing1.y - (thing1.box_height / 2) < thing2.y - (thing2.box_height / 2) + distance) return true;
  else return false;
  }

////////////////////////////////////////////////////////////////////////////////

function facing (thing1, thing2)
  {
  if (thing1.x <= thing2.x && thing1.facing === RIGHT) return true;
  else if (thing1.x >= thing2.x && thing1.facing === LEFT) return true;
  else return false;
  }

////////////////////////////////////////////////////////////////////////////////

function facing_with_margin (thing1, thing2)
  {
  if (thing2.x >= thing1.x + (thing1.box_width / 2) && thing1.facing === LEFT) return false;
  else if (thing2.x <= thing1.x - (thing1.box_width / 2) && thing1.facing === RIGHT) return false;
  else return true;
  }

////////////////////////////////////////////////////////////////////////////////

function get_direction (x1, y1, x2, y2)
  {
  var dir_radians;
  var x_distance, y_distance;

  x_distance = x2 - x1;
  y_distance = y2 - y1;

  // get radians of direction
  if (x_distance > 0 && y_distance >= 0) dir_radians = Math.atan (y_distance / x_distance);
  else if (x_distance > 0 && y_distance < 0) dir_radians = Math.atan (y_distance / x_distance) + (2 * Math.PI);
  else if (x_distance < 0) dir_radians = Math.atan (y_distance / x_distance) + Math.PI;
  else if (x_distance === 0 && y_distance > 0) dir_radians = 90 * Math.PI / 180;
  else if (x_distance === 0 && y_distance < 0) dir_radians = 270 * Math.PI / 180;
  else dir_radians = 0;  // x_distance = 0, y_distance = 0

  return dir_radians;
  }

////////////////////////////////////////////////////////////////////////////////
 
function to_radians (degrees)
  {
  return degrees * (Math.PI / 180);
  }

////////////////////////////////////////////////////////////////////////////////

function random (lowest, highest)
  {
  var rand = Math.floor ((Math.random () * (highest - lowest + 1)) + lowest);
  return rand;
  }

////////////////////////////////////////////////////////////////////////////////

function update_player ()
  {
  // x movement
  player.last_x = player.x;
  player.x += player.x_velocity + player.external_x_force;

  // bad guy x collisions
  for (var b = 0; b < badguy.length; b += 1)
    {
    if (badguy[b].active === true && are_things_colliding (player, badguy[b]))
      {
      if (player.x_velocity + player.external_x_force < 0)
        {
        player.x = badguy[b].x + (badguy[b].box_width / 2) + (player.box_width / 2);
        if (player.external_x_force < 0) badguy[b].external_x_force += player.external_x_force;
        }
      else if (player.x_velocity + player.external_x_force > 0)
        {
        player.x = badguy[b].x - (badguy[b].box_width / 2) - (player.box_width / 2);
        if (player.external_x_force > 0) badguy[b].external_x_force += player.external_x_force;
        }
      }
    }

  // y movement
  player.last_y = player.y;
  player.y += player.y_velocity + player.external_y_force;

  // bad guy y collisions
  for (var b = 0; b < badguy.length; b += 1)
    {
    if (badguy[b].active === true && are_things_colliding (player, badguy[b]))
      {
      if (player.y_velocity + player.external_y_force > 0)
        {
        // bounce off head
        player.y = badguy[b].y - badguy[b].box_height;
        player.y_velocity = -8;
        player.external_y_force = 0;
        player.change_action (JUMPING);
        if (bounce_multiplier <= 0) bounce_multiplier = 10;
        else bounce_multiplier *= 2;
        if (bounce_multiplier > max_bounce_points) bounce_multiplier = max_bounce_points;
        if (bounce_multiplier > 0) bounce_points = true;
        damage_badguy (badguy[b], player.attack_power, player);
        play_sound ("land");
        }
      else if (player.y_velocity + player.external_y_force < 0)
        {
        player.y = badguy[b].y + player.box_height;
        if (player.action === JUMPING)
          {
          player.y_velocity = 0;
          player.change_action (FALLING);
          }
        }
      }
    }

  // screen collisions
  if (player.x - (player.box_width / 2) < 0)
    {
    player.x = player.box_width / 2;
    player.external_x_force = 0;
    }
  if (player.x + (player.box_width / 2) > screen_width)
    {
    player.x = screen_width - (player.box_width / 2);
    player.external_x_force = 0;
    }
  if (player.y - player.box_height < 0)
    {
    player.y = player.box_height;
    if (player.y_velocity < 0) player.y_velocity = 0;
    }
  if (player.y > screen_height) player.y = screen_height;

  // tile collisions
  var tile = find_tile_character_on (player);
  var clip = true;
  for (var l = 0; l < player.no_clip_list.length; l += 1)
    {
    if (tile === player.no_clip_list[l]) clip = false;
    }
  if (tile === null || clip === false) player.on_ground = false;
  else
    {
    player.y = tile.y;
    player.external_y_force = 0;
    if (player.action === JUMPING || player.action === FALLING) player.change_action (STANDING);
    if (player.on_ground === false)
      {
      player.on_ground = true;
      play_sound ("land");
      bounce_points = false;
      bounce_multiplier = 0;
      }
    player.no_clip_list = [];
    }

  // update force
  if (player.external_x_force > 0) player.external_x_force -= 1;
  if (player.external_x_force < 0) player.external_x_force += 1;
  if (player.y_velocity < 0)  // going up
    {
    player.y_velocity += gravity_acceleration;
    if (player.y_velocity > 0) player.y_velocity = 0;
    }
  else
    {
    player.external_y_force += gravity_acceleration;
    if (player.external_y_force > max_gravity) player.external_y_force = max_gravity;
    }

  // blinking
  if (player.frame_counter === 0 && (player.action === STANDING || player.action === WALKING))
    {
    if (player.blinking === false && random (0, 20) === 0) player.blinking = true;
    else if (player.blinking === true) player.blinking = false;
    }

  // punching
  if ((player.action === ATTACKING1 || player.action === ATTACKING2) && player.frame_in_sequence === 1 && player.frame_counter === 0)
    {
    check_for_player_punch();
    }

  // jumping
  if (player.on_ground === false)
    {
    if (player.y_velocity < 0 && player.action !== JUMPING && player.action !== ATTACKING3 && player.action !== ATTACKING4 && player.action !== HURT) player.change_action (JUMPING);
    else if (player.y_velocity + player.external_y_force > 0 && player.action !== FALLING && player.action !== ATTACKING3 && player.action !== ATTACKING4 && player.action !== HURT) player.change_action (FALLING);
    }

  // animation frame delay
  player.frame_counter += 1;
  var animation = player.get_animation();
  var frame_delay = animation.frame_delay_list[player.frame_in_sequence];
  if (player.frame_counter > frame_delay)
    {
    player.frame_counter = 0;
    if (player.action === DEAD && player.opacity > 0.0)
      {
      player.opacity -= 0.01;
      if (player.opacity < 0.0) player.opacity = 0.0;
      }
    player.frame_in_sequence += 1;
    if (player.frame_in_sequence > animation.frame_list.length - 1)
      {
      if (animation.looping === true) player.frame_in_sequence = 0;
      else if (player.action === DEATH) player.change_action (DEAD);
      else if (player.action === ATTACKING3)
        {
        if (player.y_velocity + player.external_y_force < 0) player.change_action (JUMPING);
        else if (player.y_velocity + player.external_y_force > 0) player.change_action (FALLING);
        }
      else player.change_action (STANDING);
      }
    }
  }

////////////////////////////////////////////////////////////////////////////////

function update_badguys ()
  {
  if (player.active === true && random (0, badguy_chance) === 0) create_new_badguy();

  for (var b = 0; b < badguy.length; b += 1)
    {
    var animation = badguy[b].get_animation();

    // x movement
    badguy[b].x += badguy[b].x_velocity + badguy[b].external_x_force;

    // player x collisions
    if (badguy[b].active === true && are_things_colliding (badguy[b], player))
      {
      if (badguy[b].x_velocity + badguy[b].external_x_force < 0)
        {
        badguy[b].x = player.x + (player.box_width / 2) + (badguy[b].box_width / 2);
        if (badguy[b].external_x_force < 0) player.external_x_force += badguy[b].external_x_force;
        }
      else if (badguy[b].x_velocity + badguy[b].external_x_force > 0)
        {
        badguy[b].x = player.x - (player.box_width / 2) - (badguy[b].box_width / 2);
        if (badguy[b].external_x_force > 0) player.external_x_force += badguy[b].external_x_force;
        }
      }

    // bad guy x collisions
    for (var b2 = 0; b2 < badguy.length; b2 += 1)
      {
      if (b !== b2 && badguy[b2].active === true && are_things_colliding (badguy[b], badguy[b2]))
        {
        if (badguy[b].x_velocity + badguy[b].external_x_force < 0)
          {
          badguy[b].x = badguy[b2].x + (badguy[b2].box_width / 2) + (badguy[b].box_width / 2);
          if (badguy[b].external_x_force < 0 && badguy[b2].external_x_force > badguy[b].external_x_force) badguy[b2].external_x_force = badguy[b].external_x_force;
          }
        else if (badguy[b].x_velocity + badguy[b].external_x_force > 0)
          {
          badguy[b].x = badguy[b2].x - (badguy[b2].box_width / 2) - (badguy[b].box_width / 2);
          if (badguy[b].external_x_force > 0 && badguy[b2].external_x_force < badguy[b].external_x_force) badguy[b2].external_x_force = badguy[b].external_x_force;
          }
        }
      }

    // y movement
    badguy[b].last_y = badguy[b].y;
    badguy[b].y += badguy[b].y_velocity + badguy[b].external_y_force;

    // player y collisions
    if (badguy[b].active === true && are_things_colliding (badguy[b], player))
      {
      if (badguy[b].y_velocity + badguy[b].external_y_force > 0) badguy[b].y = player.y - player.box_height;
      else if (badguy[b].y_velocity + badguy[b].external_y_force < 0) badguy[b].y = player.y + badguy[b].box_height;
      }

    // screen collisions
    if (badguy[b].x_velocity + badguy[b].external_x_force < 0 && badguy[b].x - (badguy[b].box_width / 2) < 0) badguy[b].x = badguy[b].box_width / 2;
    if (badguy[b].x_velocity + badguy[b].external_x_force > 0 && badguy[b].x + (badguy[b].box_width / 2) > screen_width) badguy[b].x = screen_width - (badguy[b].box_width / 2);
    if (badguy[b].y_velocity + badguy[b].external_y_force > 0 && badguy[b].y > screen_height) badguy[b].y = screen_height;
    if (badguy[b].y_velocity + badguy[b].external_y_force < 0 && badguy[b].y - badguy[b].box_height < 0) badguy[b].y = badguy[b].box_height;

    // tile collisions
    var tile = find_tile_character_on (badguy[b]);
    if (tile === null) badguy[b].on_ground = false;
    else
      {
      badguy[b].y = tile.y;
      badguy[b].external_y_force = 0;
      if (badguy[b].action === JUMPING) badguy[b].change_action (STANDING);
      if (badguy[b].on_ground === false)
        {
        badguy[b].on_ground = true;
        play_sound ("land");
        }
      }

    // update force
    if (badguy[b].external_x_force > 0) badguy[b].external_x_force -= 1;
    if (badguy[b].external_x_force < 0) badguy[b].external_x_force += 1;
    if (badguy[b].y_velocity < 0)  // going up
      {
      badguy[b].y_velocity += gravity_acceleration;
      if (badguy[b].y_velocity > 0) badguy[b].y_velocity = 0;
      }
    else
      {
      badguy[b].external_y_force += gravity_acceleration;
      if (badguy[b].external_y_force > max_gravity) badguy[b].external_y_force = max_gravity;
      }

    // waiting
    if (player.active === false && badguy[b].active === true) badguy[b].change_action (WAITING);

    // blinking
    if (badguy[b].frame_counter === 0 && (badguy[b].action === STANDING || badguy[b].action === WALKING))
      {
      if (badguy[b].blinking === false && random (0, 20) === 0)
        {
        badguy[b].blinking = true;
        }
      else if (badguy[b].blinking === true)
        {
        badguy[b].blinking = false;
        }
      }

    // change direction
    if (badguy[b].action === STANDING && !facing_with_margin (badguy[b], player)) badguy[b].turn_around();
    if (badguy[b].action === WALKING)
      {
      if (!facing_with_margin (badguy[b], player) && badguy[b].facing === RIGHT) badguy[b].change_action (WALKING, LEFT);
      if (!facing_with_margin (badguy[b], player) && badguy[b].facing === LEFT) badguy[b].change_action (WALKING, RIGHT);
      }

    // waking up
    if (badguy[b].action === WAITING && player.active === true && close_enough (badguy[b], player, screen_width))
      {
      badguy[b].change_action (WAKING);
      }

    // attacking
    if (badguy[b].active === true && player.active === true && (badguy[b].action === STANDING || badguy[b].action === WALKING) && close_enough (badguy[b], player, badguy[b].attack_distance) && facing (badguy[b], player))
      {
      badguy[b].change_action (ATTACKING1);
      }

    if (badguy[b].action === ATTACKING1 && badguy[b].frame_in_sequence === 1 && badguy[b].frame_counter === 0)
      {
      play_sound ("knife");
      if (player.active === true && close_enough (badguy[b], player, badguy[b].attack_distance) && facing (badguy[b], player))
        {
        var force = 5;
        var direction = badguy[b].facing;
        player.damage (badguy[b].attack_power, badguy[b], force, direction);
        play_sound ("stab");
        }
      }

    // animation frame delay
    badguy[b].frame_counter += 1;
    animation = badguy[b].get_animation();
    var frame_delay = animation.frame_delay_list[badguy[b].frame_in_sequence];
    if (badguy[b].frame_counter > frame_delay)
      {
      badguy[b].frame_counter = 0;
      if (badguy[b].action === DEAD) badguy[b].opacity -= 0.02;
      badguy[b].frame_in_sequence += 1;
      if (badguy[b].frame_in_sequence > animation.frame_list.length - 1)
        {
        if (badguy[b].action === STANDING)
          {
          if (player.active === true) badguy[b].change_action (WALKING);
          else badguy[b].change_action (WAITING);
          }
        if (animation.looping === true) badguy[b].frame_in_sequence = 0;
        else if (badguy[b].action === WAITING)
          {
          if (player.active === true) badguy[b].change_action (WAKING);
          }
        else if (badguy[b].action === DEATH) badguy[b].change_action (DEAD);
        else
          {
          badguy[b].change_action (STANDING);
          }
        }
      }
    }

  // Remove dead guys.
  b = 0;
  while (badguy.length > 0 && b < badguy.length)
    {
    if (badguy[b].action === DEAD && badguy[b].opacity <= 0.01) badguy.splice (b, 1);
    else b += 1;
    }
  }

////////////////////////////////////////////////////////////////////////////////

function update_items ()
  {
  if (player.active === true && points >= minimum_points_for_bombs && random (0, bomb_chance) === 0)
    {
    var bomb = new Item();
    var location = random (1, 3);
    var x, y, x_velocity, y_velocity;
    if (location === 1)
      {
      x = -50;
      y = random (200, 500);
      x_velocity = random (4, 8);
      y_velocity = random (-5, -15);
      }
    if (location === 2)
      {
      x = random (screen_width / 2 - 400, screen_width / 2 + 400);
      y = 0;
      x_velocity = 0;
      y_velocity = 0;
      }
    if (location === 3)
      {
      x = screen_width + 50;;
      y = random (200, 500);
      x_velocity = random (-4, -8);
      y_velocity = random (-5, -15);
      }
    bomb.init (BOMB, x, y, x_velocity, y_velocity);
    item.push (bomb);
    }

  for (var i = 0; i < item.length; i += 1)
    {
    var animation = item[i].get_animation();

    // x movement
    item[i].x += item[i].x_velocity;

    // y movement
    item[i].last_y = item[i].y;
    item[i].y += item[i].y_velocity;

    // leaving the screen
    if (item[i].punched === true && item[i].x_velocity < 0 && item[i].x + (item[i].box_width / 2) < 0) item[i].active = false;
    if (item[i].punched === true && item[i].x_velocity > 0 && item[i].x - (item[i].box_width / 2) > screen_width) item[i].active = false;
    
    // screen collisions
    if (item[i].punched === false && item[i].x_velocity < 0 && item[i].x - (item[i].box_width / 2) < 0) item[i].x = item[i].box_width / 2;
    if (item[i].punched === false && item[i].x_velocity > 0 && item[i].x + (item[i].box_width / 2) > screen_width) item[i].x = screen_width - (item[i].box_width / 2);
    if (item[i].punched === false && item[i].y_velocity > 0 && item[i].y > screen_height) item[i].y = screen_height;
    if (item[i].punched === false && item[i].y_velocity < 0 && item[i].y - item[i].box_height < 0)
      {
      item[i].y = item[i].box_height;
      item[i].y_velocity = 0;
      item[i].falling_apex = item[i].y;
      }

    // tile collisions
    var tile = find_tile_item_on (item[i]);
    if (tile === null) item[i].on_ground = false;
    else
      {
      item[i].y = tile.y;
      if (item[i].bounces === 0)
        {
        item[i].y_velocity = -5;//Math.floor((item[i].falling_apex - item[i].y) / 50);
        item[i].x_velocity /= 2;
        play_sound ("land");
        }
      else
        {
        if (item[i].on_ground === false)
          {
          item[i].on_ground = true;
          play_sound ("land");
          }
        item[i].x_velocity = 0;
        item[i].y_velocity = 0;
        }
      if (item[i].bounces < item[i].max_bounces) item[i].bounces += 1;
      }

    // update force
    if (item[i].external_x_force > 0) item[i].external_x_force -= 1;
    if (item[i].external_x_force < 0) item[i].external_x_force += 1;
    var last_y_velocity = item[i].y_velocity;
    item[i].y_velocity += gravity_acceleration;
    if (item[i].y_velocity > max_gravity) item[i].y_velocity = max_gravity;
    if (last_y_velocity < 0 && item[i].y_velocity >= 0) item[i].falling_apex = item[i].y;

    // attacking
    if (item[i].type === BOMB && item[i].action === WAITING && item[i].animation_loops >= 18) item[i].change_action (ATTACKING1);
    if (item[i].type === BOMB && item[i].action === ATTACKING1 && item[i].animation_loops >= 12)
      {
      // detonate
      item[i].active = false;

      var boom = new Explosion();
      boom.init (item[i].x, item[i].y - (item[i].box_height / 2));
      boom.attack_distance = item[i].attack_distance;
      boom.attack_power = item[i].attack_power;
      explosion.push (boom);

      var pop = new Popup();
      var words = random (6, 7);
      pop.init (item[i].x, item[i].y - (item[i].box_height / 2), words, 0);
      popup.push (pop);

      play_sound ("explosion");

      earthquake = 5;
      }

    // animation frame delay
    item[i].frame_counter += 1;
    animation = item[i].get_animation();
    var frame_delay = animation.frame_delay_list[item[i].frame_in_sequence];
    if (item[i].frame_counter > frame_delay)
      {
      item[i].frame_counter = 0;
      item[i].frame_in_sequence += 1;
      if (item[i].frame_in_sequence > animation.frame_list.length - 1)
        {
        if (animation.looping === true)
          {
          item[i].frame_in_sequence = 0;
          item[i].animation_loops += 1;
          }
        }
      }
    }

  // Remove used items.
  i = 0;
  while (item.length > 0 && i < item.length)
    {
    if (item[i].active === false) item.splice (i, 1);
    else i += 1;
    }
  }

////////////////////////////////////////////////////////////////////////////////

function update_explosions ()
  {
  var max_force = 30;
  var direction = LEFT;

  for (var e = 0; e < explosion.length; e += 1)
    {
    if (explosion[e].active === true)
      {
      if (explosion[e].size < explosion_radius * 2)
        {
        explosion[e].size += 40;
        if (explosion[e].size >= explosion_radius * 2)
          {
          explosion[e].size = explosion_radius * 2;

          // player damage
          var distance = get_distance (explosion[e], player);
          if (player.active === true && distance < explosion[e].attack_distance)
            {
            direction = LEFT;
            if (explosion[e].x < player.x) direction = RIGHT;

            // damage and force will be percentage of distance from explosion
            var distance_percentage = 1 - (distance / explosion[e].attack_distance);
            if (distance_percentage > 1.0) distance_percentage = 1.0;
            var force = Math.floor (max_force * distance_percentage);
            var damage = Math.floor (explosion[e].attack_power * distance_percentage * 1.2);
            player.damage (damage, explosion[e], force, direction);
            player.external_y_force -= force / 2;
            }

          // bad guy damage
          for (var b = 0; b < badguy.length; b += 1)
            {
            if (badguy[b].active === true)
              {
              distance = get_distance (explosion[e], badguy[b]);
              if (distance < explosion[e].attack_distance)
                {
                direction = LEFT;
                if (explosion[e].x < badguy[b].x) direction = RIGHT;

                // force will be percentage of distance from explosion
                var distance_percentage = 1 - (distance / explosion[e].attack_distance);
                distance_percentage += .2;  // manual tweaks
                if (distance_percentage > 1.0) distance_percentage = 1.0;
                var force = Math.floor (max_force * distance_percentage);
                badguy[b].damage (0, explosion[e], force, direction);
                badguy[b].external_y_force -= force / 2;
                }
              }
            }
          }
        }
      else if (explosion[e].opacity > 0.0)
        {
        explosion[e].opacity -= 0.15;
        if (explosion[e].opacity < 0.0) explosion[e].opacity = 0.0;
        }
      else explosion[e].active = false;
      }
    }

  // Remove old explosions.
  e = 0;
  while (explosion.length > 0 && e < explosion.length)
    {
    if (explosion[e].active === false) explosion.splice (e, 1);
    else e += 1;
    }
  }

////////////////////////////////////////////////////////////////////////////////

function update_popups ()
  {
  for (var p = 0; p < popup.length; p += 1)
    {
    popup[p].y += popup[p].y_velocity;
    if (popup[p].opacity > 0.0)
      {
      popup[p].opacity -= popup[p].fade_speed;
      if (popup[p].opacity < 0.0) popup[p].opacity = 0.0
      }
    else popup[p].active = false;
    }

  p = 0;
  while (popup.length > 0 && p < popup.length)
    {
    if (popup[p].active === false) popup.splice (p, 1);
    else p += 1;
    }
  }

////////////////////////////////////////////////////////////////////////////////

function update_hud ()
  {
  if (display_points < points)
    {
    var diff = points - display_points;
    var increase = Math.floor (diff / 30);
    if (increase < 1) increase = 1;
    display_points += increase;
    if (display_points > points) display_points = points;
    update_display_points();
    }

  button_opacity -= 0.001;
  if (button_opacity < 0.0) button_opacity = 0.0;

  if (reload_counter > 0) reload_counter += 1;
  if (reload_counter >= reload_delay)
    {
    reload_showing = true;
    reload_counter = 0;
    reload_version = random (1, 3);
    }
  if (reload_showing === true && reload_opacity < 1.0) reload_opacity += 0.03;
  if (reload_opacity > 1.0) reload_opacity = 1.0;

  if (earthquake > 0.0)
    {
    level_x_offset = random (Math.floor (-earthquake), Math.floor (earthquake));
    level_y_offset = random (Math.floor (-earthquake), Math.floor (earthquake));
    earthquake -= 0.2;
    if (earthquake < 0.0)
      {
      earthquake = 0.0;
      level_x_offset = 0;
      level_y_offset = 0;
      }
    }
  }

////////////////////////////////////////////////////////////////////////////////

function check_for_player_punch ()
  {
  for (var b = 0; b < badguy.length; b += 1)
    {
    if (badguy[b].active === true && close_enough (player, badguy[b], player.attack_distance) && facing (player, badguy[b]))
      {
      var force = 15;
      var direction = player.facing;
      if (bounce_points === true)
        {
        if (bounce_multiplier <= 0) bounce_multiplier = 10;
        else bounce_multiplier *= 2;
        if (bounce_multiplier > max_bounce_points) bounce_multiplier = max_bounce_points;
        }

      var words = random (1, 4);
      var pop = new Popup();
      var x = player.x + player.box_width;
      if (player.facing === LEFT) x = player.x - player.box_width;
      pop.init (x, player.y - Math.floor (player.box_height * .75), words, 0);
      popup.push (pop);

      damage_badguy (badguy[b], player.attack_power, player, force, direction);
      play_sound ("punch");
      }
    }
  for (var i = 0; i < item.length; i += 1)
    {
    if (item[i].type === BOMB && item[i].active === true && close_enough (player, item[i], player.attack_distance) && facing (player, item[i]))
      {
      item[i].x_velocity = 30;
      if (player.facing === LEFT) item[i].x_velocity *= -1;
      item[i].y_velocity = -5;
      item[i].punched = true;
      update_points (1000, item[i]);
      play_sound ("punch");
      }
    }
  }

////////////////////////////////////////////////////////////////////////////////

function are_things_colliding (thing1, thing2)
  {
  // if both things are people and one of them is knocked out, no collisions
  if ((thing1.thing_type === PLAYER || thing1.thing_type === BADGUY)
      && (thing2.thing_type === PLAYER || thing2.thing_type === BADGUY))
	  {
	  if (thing1.active === false) return false;
	  if (thing2.active === false) return false;
	  if (thing1.action === DEATH || thing1.action === DEAD) return false;
	  if (thing2.action === DEATH || thing2.action === DEAD) return false;
	  }

  var thing1_left = thing1.x - (thing1.box_width / 2);
  var thing1_right = thing1.x + (thing1.box_width / 2);
  var thing1_top = thing1.y - thing1.box_height;
  var thing1_bottom = thing1.y;

  var thing2_left = thing2.x - (thing2.box_width / 2);
  var thing2_right = thing2.x + (thing2.box_width / 2);
  var thing2_top = thing2.y - thing2.box_height;
  var thing2_bottom = thing2.y;

  if (thing1_right > thing2_left
      && thing1_left < thing2_right
      && thing1_bottom > thing2_top
      && thing1_top < thing2_bottom) return true;
  else return false;
  }

////////////////////////////////////////////////////////////////////////////////

function is_thing_colliding_with_tile (thing, tile)
  {
  if (tile.foreground === false) return false;

  var thing_left = thing.x - (thing.box_width / 2);
  var thing_right = thing.x + (thing.box_width / 2);
  var thing_top = thing.y - thing.box_height;
  var thing_bottom = thing.y;

  var tile_left = tile.x;
  var tile_right = tile.x + tilesize_x;
  var tile_top = tile.y;
  var tile_bottom = tile.y + tilesize_y;

  if (thing_right > tile_left
      && thing_left < tile_right
      && thing_bottom > tile_top
      && thing_top < tile_bottom) return true;
  else return false;
  }

////////////////////////////////////////////////////////////////////////////////

function is_thing_on_tile (thing, tile)
  {
  if (tile.foreground === false) return false;
  if (thing.last_y > tile.y) return false;

  var thing_left = thing.x - (thing.box_width / 2);
  var thing_right = thing.x + (thing.box_width / 2);
  var thing_top = thing.y + 1 - thing.box_height;
  var thing_bottom = thing.y + 1;

  var tile_left = tile.x;
  var tile_right = tile.x + tilesize_x;
  var tile_top = tile.y;
  var tile_bottom = tile.y + tilesize_y;

  if (thing_right > tile_left
      && thing_left < tile_right
      && thing_bottom > tile_top
      && thing_top < tile_bottom) return true;
  else return false;
  }

////////////////////////////////////////////////////////////////////////////////

function find_tile_character_on (character)
  {
  if (character.y_velocity + character.external_y_force <= 0) return null;

  for (var t = 0; t < tile_list.length; t += 1)
    {
    if (is_thing_on_tile (character, tile_list[t])) return tile_list[t];
    }

  return null;
  }

////////////////////////////////////////////////////////////////////////////////

function find_all_tiles_character_on (character)
  {
  if (character.y_velocity + character.external_y_force <= 0) return null;

  var list = [];

  for (var t = 0; t < tile_list.length; t += 1)
    {
    if (is_thing_on_tile (character, tile_list[t])) list.push (tile_list[t]);
    }

  return list;
  }

////////////////////////////////////////////////////////////////////////////////

function find_tile_item_on (item)
  {
  if (item.y_velocity + item.external_y_force <= 0) return null;

  for (var t = 0; t < tile_list.length; t += 1)
    {
    if (is_thing_on_tile (item, tile_list[t])) return tile_list[t];
    }

  return null;
  }

////////////////////////////////////////////////////////////////////////////////

function update_points (add_points, source)
  {
  points += add_points;
  if (add_points >= 500) play_sound ("bonus");

  if (source !== undefined && source !== null)
    {
    var pop = new Popup();
    pop.init (source.x - (source.box_width / 2), source.y - source.box_height, POINTS, add_points);
    popup.push (pop);
    }

  if (badguy_chance > badguy_final_chance) badguy_chance = Math.floor (badguy_chance - (add_points * 0.1));
  if (points > minimum_points_for_bombs && bomb_chance > bomb_final_chance)
    {
    bomb_chance = Math.floor (bomb_chance - (add_points * 0.1));
    }

  if (min_active_badguys < 4)
    {
    min_active_badguys = Math.floor (points / 5000) + 1;
    if (min_active_badguys < 1) min_active_badguys = 1;
    if (min_active_badguys > max_active_badguys) min_active_badguys = max_active_badguys;
    }
  }

////////////////////////////////////////////////////////////////////////////////

function update_display_points ()
  {
  var points2 = display_points;
  var multiples_of_this_digit;
  var decrementer = 10;
  for (var d = 0; d < points_max_digits - 2; d += 1) decrementer *= 10;
  points_array = [];
  while (decrementer >= 1)
    {
    multiples_of_this_digit = 0;
    while (points2 >= 0)
      {
      points2 -= decrementer;
      multiples_of_this_digit += 1;
      }
    points2 += decrementer;
    points_array.push (multiples_of_this_digit - 1);
    decrementer /= 10;
    }
  }

////////////////////////////////////////////////////////////////////////////////

function create_new_badguy ()
  {
  if (badguy.length >= max_badguys) return;
  if (number_of_active_badguys() >= max_active_badguys) return;

  var guy = new Bad_Guy();
  var location = random (1, 3);
  var x, y;
  if (location === 1)
    {
    x = -50;
    y = screen_height - (tilesize_y * 2);
    }
  if (location === 2)
    {
    x = screen_width / 2;
    y = 0;
    }
  if (location === 3)
    {
    x = screen_width + 50;;
    y = screen_height - (tilesize_y * 2);
    }
  guy.init (DEALER, x, y);
  badguy.push (guy);
  }

////////////////////////////////////////////////////////////////////////////////

function number_of_active_badguys ()
  {
  var active = 0;

  for (var b = 0; b < badguy.length; b += 1)
    {
    if (badguy[b].active === true) active += 1;;
    }
  return active;
  }

////////////////////////////////////////////////////////////////////////////////

function damage_badguy (guy, damage, source, optional_force, optional_direction)
  {
  guy.damage (damage, source, optional_force, optional_direction);
  if (guy.health <= 0 && number_of_active_badguys() < min_active_badguys) create_new_badguy();
  if (max_active_badguys < max_badguys) max_active_badguys += 1;
  }

////////////////////////////////////////////////////////////////////////////////

function check_jump_down (character)
  {
  var list = find_all_tiles_character_on (character);
  var can_jump_down = true;
  
  for (var l = 0; l < list.length; l += 1)
    {
    if (list[l].jumpdown === false) can_jump_down = false;
    }

  if (can_jump_down === true)
    {
    character.no_clip_list = list;
    character.change_action (JUMPING_DOWN);
    }
  }

////////////////////////////////////////////////////////////////////////////////

function play_sound (sound)
  {
  var s;
  
  if (sound === "start") createjs.Sound.play ("start");
  else if (sound === "lose") createjs.Sound.play ("lose");
  else if (sound === "dealer hurt")
    {
    s = random (1, 5);
         if (s === 1) createjs.Sound.play ("dealer_hurt1");
    else if (s === 2) createjs.Sound.play ("dealer_hurt2");
    else if (s === 3) createjs.Sound.play ("dealer_hurt3");
    else if (s === 4) createjs.Sound.play ("dealer_hurt4");
    else if (s === 5) createjs.Sound.play ("dealer_hurt5");
    }
  else if (sound === "dealer death")
    {
    s = random (1, 4);
         if (s === 1) createjs.Sound.play ("dealer_death1");
    else if (s === 2) createjs.Sound.play ("dealer_death2");
    else if (s === 3) createjs.Sound.play ("dealer_death3");
    else if (s === 4) createjs.Sound.play ("dealer_death4");
    }
  else if (sound === "explosion")
    {
    s = random (1, 6);
         if (s === 1) createjs.Sound.play ("explosion1");
    else if (s === 2) createjs.Sound.play ("explosion2");
    else if (s === 3) createjs.Sound.play ("explosion3");
    else if (s === 4) createjs.Sound.play ("explosion4");
    else if (s === 5) createjs.Sound.play ("explosion5");
    else if (s === 6) createjs.Sound.play ("explosion6");
    }
  else if (sound === "knife")
    {
    s = random (1, 4);
         if (s === 1) createjs.Sound.play ("knife1");
    else if (s === 2) createjs.Sound.play ("knife2");
    else if (s === 3) createjs.Sound.play ("knife3");
    else if (s === 4) createjs.Sound.play ("knife4");
    }
  else if (sound === "punch")
    {
    s = random (1, 6);
         if (s === 1) createjs.Sound.play ("punch1");
    else if (s === 2) createjs.Sound.play ("punch2");
    else if (s === 3) createjs.Sound.play ("punch3");
    else if (s === 4) createjs.Sound.play ("punch4");
    else if (s === 5) createjs.Sound.play ("punch5");
    else if (s === 6) createjs.Sound.play ("punch6");
    }
  else if (sound === "land")
    {
    s = random (1, 5);
         if (s === 1) createjs.Sound.play ("land1");
    else if (s === 2) createjs.Sound.play ("land2");
    else if (s === 3) createjs.Sound.play ("land3");
    else if (s === 4) createjs.Sound.play ("land4");
    else if (s === 5) createjs.Sound.play ("land5");
    }
  else if (sound === "ultraguy jump")
    {
    s = random (1, 5);
         if (s === 1) createjs.Sound.play ("ultraguy_jump1");
    else if (s === 2) createjs.Sound.play ("ultraguy_jump2");
    else if (s === 3) createjs.Sound.play ("ultraguy_jump3");
    else if (s === 4) createjs.Sound.play ("ultraguy_jump4");
    else if (s === 5) createjs.Sound.play ("ultraguy_jump5");
    }
  else if (sound === "ultraguy hurt")
    {
    s = random (1, 6);
         if (s === 1) createjs.Sound.play ("ultraguy_hurt1");
    else if (s === 2) createjs.Sound.play ("ultraguy_hurt2");
    else if (s === 3) createjs.Sound.play ("ultraguy_hurt3");
    else if (s === 4) createjs.Sound.play ("ultraguy_hurt4");
    else if (s === 5) createjs.Sound.play ("ultraguy_hurt5");
    }
  else if (sound === "stab")
    {
    s = random (1, 8);
         if (s === 1) createjs.Sound.play ("stab1");
    else if (s === 2) createjs.Sound.play ("stab2");
    else if (s === 3) createjs.Sound.play ("stab3");
    else if (s === 4) createjs.Sound.play ("stab4");
    else if (s === 5) createjs.Sound.play ("stab5");
    else if (s === 6) createjs.Sound.play ("stab6");
    else if (s === 7) createjs.Sound.play ("stab7");
    else if (s === 8) createjs.Sound.play ("stab8");
    }
  else if (sound === "ultraguy death")
    {
    s = random (1, 7);
         if (s === 1) createjs.Sound.play ("ultraguy_death1");
    else if (s === 2) createjs.Sound.play ("ultraguy_death2");
    else if (s === 3) createjs.Sound.play ("ultraguy_death3");
    else if (s === 4) createjs.Sound.play ("ultraguy_death4");
    else if (s === 5) createjs.Sound.play ("ultraguy_death5");
    else if (s === 6) createjs.Sound.play ("ultraguy_death6");
    else if (s === 7) createjs.Sound.play ("ultraguy_death7");
    }
  else if (sound === "ultraguy start")
    {
    s = random (1, 8);
         if (s === 1) createjs.Sound.play ("ultraguy_start1");
    else if (s === 2) createjs.Sound.play ("ultraguy_start2");
    else if (s === 3) createjs.Sound.play ("ultraguy_start3");
    else if (s === 4) createjs.Sound.play ("ultraguy_start4");
    else if (s === 5) createjs.Sound.play ("ultraguy_start5");
    else if (s === 6) createjs.Sound.play ("ultraguy_start6");
    else if (s === 7) createjs.Sound.play ("ultraguy_start7");
    else if (s === 8) createjs.Sound.play ("ultraguy_start8");
    }
  else if (sound === "bonus") createjs.Sound.play ("bonus");
  }

////////////////////////////////////////////////////////////////////////////////
