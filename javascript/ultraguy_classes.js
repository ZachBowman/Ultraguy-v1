// Ultraguy
// Nightmare Games 2018
// Zach Bowman

////////////////////////////////////////////////////////////////////////////////

// game state references (for game_state and fade transitions)
var NONE         = 0;
var TITLE        = 1;
var GAME         = 2;
var INSTRUCTIONS = 3;

// control types
var NO_CONTROL = 0;
var KEYBOARD_CONTROL = 1;
var CLICK_CONTROL = 2;  // finger or mouse

// direction references
var NONE  = 0;
var LEFT  = 1;
var RIGHT = 2;

// fade directions
var OUT = 1;
var IN = 2;

// thing types
var PLAYER    = 0;
var BADGUY    = 1;
var ITEM      = 2;
var TILE      = 3;
var EXPLOSION = 4;

// action references
var WAITING      = 0;  // hasn't seen player yet
var WAKING       = 1;  // notices player, gets ready to move
var STANDING     = 2;  // idle
var WALKING      = 3;
var ATTACKING1   = 4;
var ATTACKING2   = 5;
var ATTACKING3   = 6;
var ATTACKING4   = 7;
var HURT         = 8;
var DEATH        = 9;
var DEAD         = 10;
var JUMPING      = 11;
var FALLING      = 12;
var LANDING      = 13;
var JUMPING_DOWN = 14;

// bad guy types
var DEALER = 0;

// item types
var BOMB = 0;

// map symbols
var _  =  0;
var Df =  1;  // dirt with fade-out
var D  =  2;  // dirt
var Ds =  3;  // dirt with sidewalk
var G  =  4;  // grass
var B  =  5;  // brick
var Bb =  6;  // brick background
var S  =  7;  // stone
var Sb =  8;  // stone background
var I  =  9;  // steel I-beam
var Cb = 10;  // verticle cable (background)

// popup types
var POINTS = 0;
var BAM = 1;
var POW = 2;
var POP = 3;
var WHAM = 4;
var SLASH = 5;
var BOOOM = 6;
var KABOOM = 7;

////////////////////////////////////////////////////////////////////////////////

function Player ()
  {
  this.thing_type = PLAYER;
  this.x = 0;
  this.y = 0;
  this.sprite_width = 120;
  this.sprite_height = 160;
  this.box_width = 52;
  this.box_height = 136;
  this.health = 100;
  this.x_velocity = 0;
  this.y_velocity = 0;
  this.facing = RIGHT;
  this.walking_speed = 3;
  this.frame_in_sequence = 0;  // the index of the current frame in the current sequence in animation_list
  this.frame_counter = 0;
  this.frame_delay = 2;
  this.action = STANDING;
  this.blinking = false;
  this.animation_list = [];
  this.animation_reference = [];  // stores indices for the animation_list for quick look-up
  this.attack_power = 20;
  this.attack_distance = 80;
  this.external_x_force = 0;
  this.external_y_force = 0;
  this.active = true;
  this.tombstone_height = 0;
  this.opacity = 1.0;
  this.last_x = this.x;
  this.last_y = this.y;
  this.on_ground = false;
  this.next_punch = RIGHT;  // alternates right/left
  this.no_clip_list = [];  // list of tiles player can temporarily pass through for jumping down

  this.init = function ()
    {
    this.x = (screen_width / 2);
    this.y = 300;
    this.active = true;
    this.health = 100;
    this.action = STANDING;
    this.tombstone_height = 0;
    this.opacity = 1.0;

    this.animation_list = [];
    this.aimation_reference = [];

    this.add_animation (STANDING, [0], [5], true);
    this.add_animation (WALKING, [2, 3, 4, 5, 6, 7, 8, 9], [3, 3, 3, 3, 3, 3, 3, 3], true);
    this.add_animation (ATTACKING1, [10, 11, 12], [3, 4, 7], false);  // punch right
    this.add_animation (ATTACKING2, [12, 13, 10], [3, 4, 7], false);  // punch left
    this.add_animation (ATTACKING3, [27], [10], false);  // jumping punch right
    this.add_animation (ATTACKING4, [28], [10], false);  // jumping punch left
    this.add_animation (HURT, [15, 14, 15, 14], [2, 2, 2, 2], false);
    this.add_animation (DEATH, [14, 16, 17, 18, 19, 20, 21, 22], [8, 8, 8, 8, 8, 8, 8, 8], false);
    this.add_animation (DEAD, [22], [10], true);
    this.add_animation (JUMPING, [24], [5], true);
    this.add_animation (FALLING, [25], [5], true);
    }

  // set the action and start a new animation sequence
  this.change_action = function (action, optional_facing)
    {
    if (this.active === false && action !== DEATH && action !== DEAD) return;

    this.action = action;
    var animation = this.animation_list[this.animation_reference[action]];
    if (optional_facing !== undefined && optional_facing !== null) this.facing = optional_facing;
    if (action === DEATH) this.tombstone_height = 0;

    // only restart these animations if player isn't already doing them
    if (action === WALKING && this.action === action) return;
    this.frame_in_sequence = 0;
    this.frame_counter = 1;
    }

  // stick a new animation in the list and reference array
  this.add_animation = function (action, frame_list, frame_delay_list, looping)
    {
    var a = new Animation();
    a.action = action;
    a.frame_list = frame_list;
    a.frame_delay_list = frame_delay_list;
    a.looping = looping;
    this.animation_list.push (a);
    
    // fill in any missing gaps in the animation_reference with bogus data
    while (this.animation_reference.length <= action) this.animation_reference.push (-1);

    // store the new animation's index in the reference array under the action value
    this.animation_reference[action] = this.animation_list.length - 1;
    }

  this.get_animation = function ()
    {
    var reference = this.animation_reference[this.action];
    return this.animation_list[reference];
    }

  this.damage = function (damage, source, optional_force, optional_direction)
    {
    this.health -= damage;
    
    if (this.health <= 0)
      {
      this.health = 0;
      this.change_action (DEATH);
      this.active = false;
      play_sound ("lose");
      play_sound ("ultraguy death");
      reload_counter = 1;
      }
    else
      {
      this.change_action (HURT);
      play_sound ("ultraguy hurt");
      }
    
    if (optional_force !== null && optional_force !== undefined && optional_direction !== null && optional_direction !== undefined)
      {
      if (optional_direction === LEFT) optional_force *= -1;
      this.external_x_force += optional_force;
      }
    }
  }

////////////////////////////////////////////////////////////////////////////////

function Bad_Guy ()
  {
  this.thing_type = BADGUY;
  this.x = 0;
  this.y = 0;
  this.health = 0;
  this.x_velocity = 0;
  this.y_velocity = 0;
  this.facing = LEFT;
  this.walking_speed = null;
  this.frame_in_sequence = 0;  // the index of the current frame in the current sequence in animation_list
  this.frame_counter = 0;
  this.frame_delay = 2;
  this.action = WAITING;
  this.blinking = false;
  this.attack_power = null;
  this.attack_distance = null;
  this.external_x_force = 0;
  this.external_y_force = 0;
  this.active = true;
  this.opacity = 1.0;
  this.points = 0;

  this.animation_list = [];
  this.animation_reference = [];

  this.init = function (type, x, y)
    {
    this.x = x;
    this.y = y;
    this.type = type;

    if (type === DEALER)
      {
      this.health = 25;
      this.attack_power = 10;
      this.attack_distance = 80;
      this.walking_speed = 2;
      this.points = 100;

      this.sprite_width = 160;
      this.sprite_height = 160;
      this.box_width = 44;
      this.box_height = 130;

      this.add_animation (WAITING, [0], [10], true);
      this.add_animation (WAKING, [0, 1, 2], [5, 5, 5], false);
      this.add_animation (STANDING, [2], [5], true);
      this.add_animation (WALKING, [4, 5, 6, 7], [5, 5, 5, 5], true);
      this.add_animation (ATTACKING1, [8, 9], [12, 20], false);
      this.add_animation (HURT, [10, 0, 10, 0], [3, 3, 3, 3], false);
      this.add_animation (DEATH, [10, 0, 10, 0, 11], [3, 3, 3, 3, 10], false);
      this.add_animation (DEAD, [11], [10], true);
      }
    }

  this.add_animation = function (action, frame_list, frame_delay_list, looping)
    {
    var a = new Animation();
    a.action = action;
    a.frame_list = frame_list;
    a.frame_delay_list = frame_delay_list;
    a.looping = looping;
    this.animation_list.push (a);
    
    // fill in any missing gaps in the animation_reference with bogus data
    while (this.animation_reference.length <= action) this.animation_reference.push (-1);

    // store the new animation's index in the reference array under the action value
    this.animation_reference[action] = this.animation_list.length - 1;
    }

  this.damage = function (damage, source, optional_force, optional_direction)
    {
    this.health -= damage;
    
    if (this.health <= 0)
      {
      this.health = 0;
      this.change_action (DEATH);
      this.active = false;
      if (source === player)
        {
        if (bounce_points === true) update_points (bounce_multiplier, this);
        else update_points (this.points, this);
        }
      }
    else
      {
      if (damage > 0) this.change_action (HURT);
      if (bounce_points === true) update_points (bounce_multiplier, this);
      }
    
    if (optional_force !== null && optional_force !== undefined && optional_direction !== null && optional_direction !== undefined)
      {
      if (optional_direction === LEFT) optional_force *= -1;
      this.external_x_force += optional_force;
      }
    }

  this.get_animation = function ()
    {
    var reference = this.animation_reference[this.action];
    return this.animation_list[reference];
    }

  // set the action and start a new animation sequence
  this.change_action = function (action, optional_facing)
    {
    this.action = action;
    var animation = this.animation_list[this.animation_reference[action]];
    if (optional_facing !== undefined && optional_facing !== null)
      {
      this.facing = optional_facing;
      }

    if (action === WALKING)
      {
      if (this.facing === RIGHT) this.x_velocity = this.walking_speed;
      else this.x_velocity = -this.walking_speed;
      }
    else
      {
      this.x_velocity = 0;
      }

    if (action === HURT) play_sound ("dealer hurt");
    if (action === DEATH) play_sound ("dealer death");

    if (action !== STANDING && action !== WALKING) this.blinking = false;

    // only restart these animations if character isn't already doing them
    if (action === WALKING && this.action === action) return;
    this.frame_in_sequence = 0;
    this.frame_counter = 1;
    }

  this.turn_around = function ()
    {
    if (this.facing === LEFT) this.facing = RIGHT;
    else this.facing = LEFT;
    }
  }

////////////////////////////////////////////////////////////////////////////////

function Item ()
  {
  this.thing_type = ITEM;
  this.x = 0;
  this.y = 0;
  this.x_velocity = 0;
  this.y_velocity = 0;
  this.box_width = 0;
  this.box_height = 0;
  this.sprite_width = 0;
  this.sprite_height = 0;
  this.frame = 0;
  this.frame_in_sequence = 0;
  this.frame_counter = 0;
  this.frame_delay = 0;
  this.animation_loops = 0;
  this.max_bounces = 0;
  this.bounces = 0;
  this.max_bounces = 1;
  this.falling_apex = 0;
  this.active = null;
  this.punched = false;

  this.animation_list = [];
  this.animation_reference = [];

  this.init = function (type, x, y, x_velocity, y_velocity)
    {
    this.x = x;
    this.y = y;
    this.x_velocity = x_velocity;
    this.y_velocity = y_velocity;
    this.type = type;
    if (y_velocity >= 0) this.falling_apex = y;
    this.active = true;

    if (type === BOMB)
      {
      this.attack_power = 60;
      this.attack_distance = explosion_radius + player.box_width;
      this.box_width = 52;
      this.box_height = 76;
      this.sprite_width = 52;
      this.sprite_height = 76;

      this.add_animation (WAITING, [0, 1], [1, 1], true);
      this.add_animation (ATTACKING1, [0, 2], [1, 1], true);

      this.action = WAITING;
      }
    };

  this.add_animation = function (action, frame_list, frame_delay_list, looping)
    {
    var a = new Animation();
    a.action = action;
    a.frame_list = frame_list;
    a.frame_delay_list = frame_delay_list;
    a.looping = looping;
    this.animation_list.push (a);
    
    // fill in any missing gaps in the animation_reference with bogus data
    while (this.animation_reference.length <= action) this.animation_reference.push (-1);

    // store the new animation's index in the reference array under the action value
    this.animation_reference[action] = this.animation_list.length - 1;
    }

  this.get_animation = function ()
    {
    var reference = this.animation_reference[this.action];
    return this.animation_list[reference];
    }

  // set the action and start a new animation sequence
  this.change_action = function (action)
    {
    this.action = action;
    var animation = this.animation_list[this.animation_reference[action]];
    this.frame_in_sequence = 0;
    this.frame_counter = 1;
    this.animation_loops = 0;
    };
  }
 
////////////////////////////////////////////////////////////////////////////////

function Explosion ()
  {
  this.thing_type = EXPLOSION;
  this.x = 0;
  this.y = 0;
  this.size = 0;
  this.opacity = 1.0;
  this.active = null;
  this.attack_distance = 0;
  this.attack_power = 0;

  this.init = function (x, y)
    {
    this.x = x;
    this.y = y;
    this.active = true;
    this.size = 5;
    };
  }
 
////////////////////////////////////////////////////////////////////////////////

function Popup ()
  {
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.height = 0;
  this.number_array = [];
  this.opacity = 1.0;
  this.active = null;
  this.y_velocity = 0;

  this.init = function (x, y, type, points)
    {
    this.x = x;
    this.y = y;
    this.active = true;
    this.type = type;

    if (type === POINTS)
      {
      this.height = 28;
      this.y_velocity = -1;
      this.fade_speed = 0.02;

      var points2 = points;
      var multiples_of_this_digit;
      var decrementer = 10;
      for (var d = 0; d < points_max_digits - 2; d += 1) decrementer *= 10;
      this.number_array = [];
      var nonzero = false;
      while (decrementer >= 1)
        {
        multiples_of_this_digit = 0;
        while (points2 >= 0)
          {
          points2 -= decrementer;
          multiples_of_this_digit += 1;
          }
        points2 += decrementer;
        if (multiples_of_this_digit - 1 !== 0) nonzero = true;
        if (nonzero === true) this.number_array.push (multiples_of_this_digit - 1);
        decrementer /= 10;
        }
      this.width = this.number_array.length * 20;
      }
    else
      {
      this.fade_speed = 0.1;
      }
    }
  }

////////////////////////////////////////////////////////////////////////////////

function Animation ()
  {
  this.action = null;
  this.frame_list = [];
  this.frame_delay_list = [];
  this.looping = null;
  }

////////////////////////////////////////////////////////////////////////////////

function Map ()
  {
  this.front = [[]];
  this.back = [[]];
  this.width = 0;
  this.height = 0;
  }

////////////////////////////////////////////////////////////////////////////////

function Tile ()
  {
  this.thing_type = TILE;
  this.x = 0;
  this.y = 0;
  this.source_x = 0;
  this.source_y = 0;
  this.foreground = true;  // background tiles have no collisions and are drawn before foreground
  this.jump_down = false;   // true if player can jump straight down to a lower floor
  }

////////////////////////////////////////////////////////////////////////////////

function Button ()
  {
  this.sprite = null;
  this.x = 0;
  this.y = 0;
  this.click = null;
  this.one_shot = true;

  this.init = function (sprite, x, y, click, one_shot)
    {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.click = click;
    this.one_shot = one_shot;
    };
  }

////////////////////////////////////////////////////////////////////////////////

function Click ()
  {
  this.x = 0;
  this.y = 0;
  }

////////////////////////////////////////////////////////////////////////////////

function Touch ()
  {
  this.x = null;
  this.y = null;
  this.opacity = 1.0;
  this.active = false;

  this.init = function (x, y)
    {
    this.x = x;
    this.y = y;
    this.opacity = 1.0;
    this.active = true;
    };
  }

////////////////////////////////////////////////////////////////////////////////
