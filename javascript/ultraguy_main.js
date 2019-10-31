// Ultraguy
// Nightmare Games 2018
// Zach Bowman

////////////////////////////////////////////////////////////////////////////////

// application
var canvas_html;
var canvas_2d;
var div;
var fps = 30;
var game;

// game
var game_state = TITLE;
var game_active = false;

// video
var screen_width;
var screen_height;
var level_x_offset = 0;
var level_y_offset = 0;
var screen_size_ratio;

// title screen
var title_clicked = false;
var title_text = "LOADING";
var sound_loaded_flag = false;

// fade
var fade_opacity = 1.0;
var fade_direction = IN;
var transition = NONE;
var fade_speed = 0.05;

// tiles
var tilesize_x = 80;
var tilesize_y = 80;
var tiles_x;  // width in tiles of puzzle including walls
var tiles_y;  // height
var tile_list = [];
var map = [[]];
var earthquake = 0;

// graphics
var title_screen = Sprite ("title_test");
var solid_black = Sprite ("solid_black");
var sky = Sprite ("sky");
var tiles_sprite = Sprite ("tiles_pixels_400");
var ultraguy_sprite = Sprite ("ultraguy_pixels_400");
var dealer_sprite = Sprite ("dealer_pixels_400");
var points_sprite = Sprite ("points_pixels_400");
var lifebar_sprite = Sprite ("lifebar_pixels_400");
var bomb_sprite = Sprite ("bomb_pixels_400");
var explosion_sprite = Sprite ("explosion2");
var bam_sprite = Sprite ("bam");
var pow_sprite = Sprite ("pow");
var pop_sprite = Sprite ("pop");
var wham_sprite = Sprite ("wham");
var booom_sprite = Sprite ("booom");
var kaboom_sprite = Sprite ("kaboom");
var slash_sprite = Sprite ("slash");
var instructions_screen = Sprite ("instructions1");

var left_button_sprite = Sprite ("button_left");
var right_button_sprite = Sprite ("button_right");
var down_button_sprite = Sprite ("button_down");
var jump_button_sprite = Sprite ("button_jump");
var punch_button_sprite = Sprite ("button_punch");
var reload_sprite1 = Sprite ("death_box");
var reload_sprite2 = Sprite ("death_box2");
var reload_sprite3 = Sprite ("death_box3");
var info_button_black = Sprite ("info_button");
var info_button_white = Sprite ("info_button_white");

var click_here_counter = 0;
var click_here_delay = 20;
var click_here_onoff = true;

// animation frame counters
var frame_frame;
var frame_count;
var frame_delay;

// objects
var date = new Date();
var player = new Player();
var badguy = [];
var item = [];
var explosion = [];
var popup = [];

var left_button = new Button();
var right_button = new Button();
var down_button = new Button();
var punch_button = new Button();
var jump_button = new Button();
var info_button = new Button();
var button_opacity = 1.0;

// physics
var gravity_acceleration = .4;
var max_gravity = 12;

// hud
var life_width = 164;
var life_height = 36;
var life_x;
var life_y;

// points
var points = 0;
var display_points = 0;
var points_max_digits = 9;
var points_array = [];
var points_width = (points_max_digits * 20) + 12;
var points_height = 28;
var points_x;
var points_y;
var bounce_points = false;
var bounce_multiplier = 0;
var max_bounce_points = 500;

// difficulty
var badguy_chance = 400;
var badguy_final_chance = 150;
var bomb_chance = 500;
var bomb_final_chance = 150;
var minimum_points_for_bombs = 800;
var explosion_radius = 180;
var max_badguys = 20;
var max_active_badguys = 1;
var min_active_badguys = 1;

// reload dialog box
var reload = new Button();
var reload_opacity = 0.0;
var reload_showing = false;
var reload_delay = 200;
var reload_counter = 0;
var reload_version = 1;

// test stuff
var test_sprite = Sprite ("test");
var test2_sprite = Sprite ("test2");
var touch_test = [];
var test_delay = 80;
var test_counter = 0;
var test_show = false;

////////////////////////////////////////////////////////////////////////////////

function html_init()
  {
  canvas_html = document.getElementById ("canvas");
  canvas_2d = document.getElementById ("canvas").getContext ("2d");
  div = document.getElementById ("canvas_div");
  screen_width = Number (canvas_html.getAttribute ("width"));
  screen_height = Number (canvas_html.getAttribute ("height"));

  // div.addEventListener ("click", title_screen_click, false);
  window.addEventListener ("resize", resize_canvas, false);

  canvas_html.addEventListener   ("mousedown",   function() {mouse_down (mouse_x, mouse_y)}, false);
  canvas_html.addEventListener   ("mousemove",   function(event) {mouse_move (event, canvas_html)}, false);
  document.body.addEventListener ("mouseup",     function() {mouse_up()}, false);

  canvas_html.addEventListener   ("touchstart",  touch_start, false);
  canvas_html.addEventListener   ("touchmove",   touch_move, false);
  canvas_html.addEventListener   ("touchend",    touch_end, false);

  document.addEventListener ('keydown', keyboard_down, false);
  document.addEventListener ('keyup', keyboard_up, false);

  canvas_2d.save();
  resize_canvas();

  info_button.x = screen_width - 140;
  info_button.y = screen_height - 140;

  init_sound();
  }

////////////////////////////////////////////////////////////////////////////////

function resize_canvas ()
  {
  // Scale to fit window, decide which scaling reaches edge first.

  canvas_2d.restore();
  canvas_2d.save();

  var current_ratio = canvas_2d.canvas.width / canvas_2d.canvas.height;
  var new_ratio = window.innerWidth / window.innerHeight;
  var xratio = window.innerWidth / canvas_2d.canvas.width;
  var yratio = window.innerHeight / canvas_2d.canvas.height;

  if (current_ratio > new_ratio) screen_size_ratio = xratio;
  else screen_size_ratio = yratio;
  if (screen_size_ratio > 1) screen_size_ratio = 1;

  canvas_2d.scale (screen_size_ratio, screen_size_ratio);
  }

////////////////////////////////////////////////////////////////////////////////

setInterval (function()
  {
  if (title_clicked === false) title_screen_update();
  else game.update();

  try
    {
    if (canvas_2d)
      {
      if (title_clicked === false) title_screen_draw();
      else game.draw();
      }
    }
  catch (error)
    {
    console.log ("canvas_2d not ready yet.");
    }
  }, 1000 / fps);

////////////////////////////////////////////////////////////////////////////////

function title_screen_update ()
  {
  if (sound_loaded_flag === true)
    {
    click_here_counter += 1;
    if (click_here_counter >= click_here_delay)
      {
      click_here_counter = 0;
      if (click_here_onoff === true) click_here_onoff = false;
      else click_here_onoff = true;
      }
    }

  fade_control();
  }

////////////////////////////////////////////////////////////////////////////////

function title_screen_draw ()
  {
  if (game_state === INSTRUCTIONS) instructions_screen.draw (canvas_2d, 0, 0, 1.0);

  else
    {
    title_screen.draw (canvas_2d, 0, 0);

    if (click_here_onoff === true)
      {
      canvas_2d.font = "40px impact";
      canvas_2d.fillStyle = "#000000";
      canvas_2d.fillText ("CLICK TO START", 420, 574);
      canvas_2d.fillStyle = "#00CBFF";
      canvas_2d.fillText ("CLICK TO START", 424, 570);
      }

    info_button_black.draw (canvas_2d, info_button.x, info_button.y, 1.0);
    }

  if (fade_direction != NONE)
    {
    canvas_2d.globalAlpha = fade_opacity;
    solid_black.draw (canvas_2d, 0, 0);
    canvas_2d.globalAlpha = 1.0;
    }
  }

////////////////////////////////////////////////////////////////////////////////

function title_screen_click ()
  {
  title_clicked = true;
  div.removeEventListener ("click", title_screen_click, false);
  game = new ultraguy_namespace.ultraguy();

  play_sound ("start");
  }

////////////////////////////////////////////////////////////////////////////////

function test ()
  {
  test_show = true;
  }

////////////////////////////////////////////////////////////////////////////////

function touch_test (x, y)
  {
  touch_test_show = true;  
  }

////////////////////////////////////////////////////////////////////////////////

function show_instructions ()
  {
  transition = INSTRUCTIONS;
  fadeout();
  }

////////////////////////////////////////////////////////////////////////////////

function init_sound ()
  {
  if (!createjs.Sound.initializeDefaultPlugins()) 
    {
    console.log ("Sound not available on this device.");
    sound_loaded();
    return;
    }

  var sounds =
    [
    {id: "start",           src: "start.mp3"},
    {id: "lose",            src: "lose.mp3"},
    {id: "bonus",           src: "bonus.mp3"},
    {id: "dealer_hurt1",    src: "dealer_hurt1.mp3"},
    {id: "dealer_hurt2",    src: "dealer_hurt2.mp3"},
    {id: "dealer_hurt3",    src: "dealer_hurt3.mp3"},
    {id: "dealer_hurt4",    src: "dealer_hurt4.mp3"},
    {id: "dealer_hurt5",    src: "dealer_hurt5.mp3"},
    {id: "dealer_death1",   src: "dealer_death1.mp3"},
    {id: "dealer_death2",   src: "dealer_death2.mp3"},
    {id: "dealer_death3",   src: "dealer_death3.mp3"},
    {id: "dealer_death4",   src: "dealer_death4.mp3"},
    {id: "explosion1",      src: "explosion1_final.mp3"},
    {id: "explosion2",      src: "explosion2_final.mp3"},
    {id: "explosion3",      src: "explosion3_final.mp3"},
    {id: "explosion4",      src: "explosion4_final.mp3"},
    {id: "explosion5",      src: "explosion5_final.mp3"},
    {id: "explosion6",      src: "explosion6_final.mp3"},
    {id: "knife1",          src: "knife1.mp3"},
    {id: "knife2",          src: "knife2.mp3"},
    {id: "knife3",          src: "knife3.mp3"},
    {id: "knife4",          src: "knife4.mp3"},
    {id: "punch1",          src: "punch1c.mp3"},
    {id: "punch2",          src: "punch2c.mp3"},
    {id: "punch3",          src: "punch3c.mp3"},
    {id: "punch4",          src: "punch4c.mp3"},
    {id: "punch5",          src: "punch5c.mp3"},
    {id: "punch6",          src: "punch6c.mp3"},
    {id: "land1",           src: "land1.mp3"},
    {id: "land2",           src: "land2.mp3"},
    {id: "land3",           src: "land3.mp3"},
    {id: "land4",           src: "land4.mp3"},
    {id: "land5",           src: "land5.mp3"},
    {id: "stab1",           src: "stab1.mp3"},
    {id: "stab2",           src: "stab2.mp3"},
    {id: "stab3",           src: "stab3.mp3"},
    {id: "stab4",           src: "stab4.mp3"},
    {id: "stab5",           src: "stab5.mp3"},
    {id: "stab6",           src: "stab6.mp3"},
    {id: "stab7",           src: "stab7.mp3"},
    {id: "stab8",           src: "stab8.mp3"},
    {id: "ultraguy_jump1",  src: "ultraguy_jump1.mp3"},
    {id: "ultraguy_jump2",  src: "ultraguy_jump2.mp3"},
    {id: "ultraguy_jump3",  src: "ultraguy_jump3.mp3"},
    {id: "ultraguy_jump4",  src: "ultraguy_jump4.mp3"},
    {id: "ultraguy_jump5",  src: "ultraguy_jump5.mp3"},
    {id: "ultraguy_hurt1",  src: "ultraguy_hurt1.mp3"},
    {id: "ultraguy_hurt2",  src: "ultraguy_hurt2.mp3"},
    {id: "ultraguy_hurt3",  src: "ultraguy_hurt3.mp3"},
    {id: "ultraguy_hurt4",  src: "ultraguy_hurt4.mp3"},
    {id: "ultraguy_hurt5",  src: "ultraguy_hurt5.mp3"},
    {id: "ultraguy_hurt6",  src: "ultraguy_hurt6.mp3"},
    {id: "ultraguy_death1", src: "ultraguy_death1.mp3"},
    {id: "ultraguy_death2", src: "ultraguy_death2.mp3"},
    {id: "ultraguy_death3", src: "ultraguy_death3.mp3"},
    {id: "ultraguy_death4", src: "ultraguy_death4.mp3"},
    {id: "ultraguy_death5", src: "ultraguy_death5.mp3"},
    {id: "ultraguy_death6", src: "ultraguy_death6.mp3"},
    {id: "ultraguy_death7", src: "ultraguy_death7.mp3"},
    {id: "ultraguy_start1", src: "ultraguy_start1.mp3"},
    {id: "ultraguy_start2", src: "ultraguy_start2.mp3"},
    {id: "ultraguy_start3", src: "ultraguy_start3.mp3"},
    {id: "ultraguy_start4", src: "ultraguy_start4.mp3"},
    {id: "ultraguy_start5", src: "ultraguy_start5.mp3"},
    {id: "ultraguy_start6", src: "ultraguy_start6.mp3"},
    {id: "ultraguy_start7", src: "ultraguy_start7.mp3"},
    {id: "ultraguy_start8", src: "ultraguy_start8.mp3"}
    ];

  createjs.Sound.addEventListener ("fileload", sound_loaded);
  createjs.Sound.registerSounds (sounds, "sounds/");
  }

////////////////////////////////////////////////////////////////////////////////

function sound_loaded (event)
  {
  createjs.Sound.removeEventListener ("fileload", sound_loaded);
  title_text = "CLICK TO START";
  sound_loaded_flag = true;
  }

////////////////////////////////////////////////////////////////////////////////

this.ultraguy_namespace = this.ultraguy_namespace || {};

////////////////////////////////////////////////////////////////////////////////

(function ()
  {
   
  ////////////////////////////////////////////////////////////////////////////////

  function ultraguy ()
    {
    this.init();
    }

  ultraguy_namespace.ultraguy = ultraguy;

  ////////////////////////////////////////////////////////////////////////////////

  ultraguy.prototype.init = function ()
    {
    life_x = (screen_width / 2) - life_width - 10;
    life_y = screen_height - 36;
    points_x = (screen_width / 2) + 10;
    points_y = life_y;
    reload.x = (screen_width / 2) - (reload_sprite1.Width / 2);
    reload.y = Math.floor (screen_height * .25) - (reload_sprite1.Height / 2);

    //this.init_sound();
    transition = GAME;
    fadeout();
    }

  ////////////////////////////////////////////////////////////////////////////////

  ultraguy.prototype.update = function ()
    {
    if (game_state === GAME)
      {
      keyboard_input();
      update_player();
      update_badguys();
      update_items();
      update_explosions();
      update_popups();
      update_hud();
      }

    //Sound_Control ();
    //Music_Control ();

    // update_fade
    fade_control ();
    }
    
  ////////////////////////////////////////////////////////////////////////////////

  $(document).ready (function()
    {
    $("canvas").mousemove (function (event)
      {
      if (game_state === GAME)
        {
        mouse_x = event.pageX - this.offsetLeft;
        mouse_y = event.pageY - this.offsetTop;
        }
      });
    });

  ////////////////////////////////////////////////////////////////////////////////

  // ultraguy.prototype.init_sound = function ()
  //   {
  //   if (!createjs.Sound.initializeDefaultPlugins()) 
  //     {
  //     console.log ("Sound not available on this device.");
  //     sound_loaded();
  //     return;
  //     }

  //   var sounds =
  //     [
  //     {id: "start",           src: "start.mp3"},
  //     {id: "lose",            src: "lose.mp3"},
  //     {id: "bonus",           src: "bonus.mp3"},
  //     {id: "dealer_hurt1",    src: "dealer_hurt1.mp3"},
  //     {id: "dealer_hurt2",    src: "dealer_hurt2.mp3"},
  //     {id: "dealer_hurt3",    src: "dealer_hurt3.mp3"},
  //     {id: "dealer_hurt4",    src: "dealer_hurt4.mp3"},
  //     {id: "dealer_hurt5",    src: "dealer_hurt5.mp3"},
  //     {id: "dealer_death1",   src: "dealer_death1.mp3"},
  //     {id: "dealer_death2",   src: "dealer_death2.mp3"},
  //     {id: "dealer_death3",   src: "dealer_death3.mp3"},
  //     {id: "dealer_death4",   src: "dealer_death4.mp3"},
  //     {id: "explosion1",      src: "explosion1_final.mp3"},
  //     {id: "explosion2",      src: "explosion2_final.mp3"},
  //     {id: "explosion3",      src: "explosion3_final.mp3"},
  //     {id: "explosion4",      src: "explosion4_final.mp3"},
  //     {id: "explosion5",      src: "explosion5_final.mp3"},
  //     {id: "explosion6",      src: "explosion6_final.mp3"},
  //     {id: "knife1",          src: "knife1.mp3"},
  //     {id: "knife2",          src: "knife2.mp3"},
  //     {id: "knife3",          src: "knife3.mp3"},
  //     {id: "knife4",          src: "knife4.mp3"},
  //     {id: "punch1",          src: "punch1c.mp3"},
  //     {id: "punch2",          src: "punch2c.mp3"},
  //     {id: "punch3",          src: "punch3c.mp3"},
  //     {id: "punch4",          src: "punch4c.mp3"},
  //     {id: "punch5",          src: "punch5c.mp3"},
  //     {id: "punch6",          src: "punch6c.mp3"},
  //     {id: "land1",           src: "land1.mp3"},
  //     {id: "land2",           src: "land2.mp3"},
  //     {id: "land3",           src: "land3.mp3"},
  //     {id: "land4",           src: "land4.mp3"},
  //     {id: "land5",           src: "land5.mp3"},
  //     {id: "stab1",           src: "stab1.mp3"},
  //     {id: "stab2",           src: "stab2.mp3"},
  //     {id: "stab3",           src: "stab3.mp3"},
  //     {id: "stab4",           src: "stab4.mp3"},
  //     {id: "stab5",           src: "stab5.mp3"},
  //     {id: "stab6",           src: "stab6.mp3"},
  //     {id: "stab7",           src: "stab7.mp3"},
  //     {id: "stab8",           src: "stab8.mp3"},
  //     {id: "ultraguy_jump1",  src: "ultraguy_jump1.mp3"},
  //     {id: "ultraguy_jump2",  src: "ultraguy_jump2.mp3"},
  //     {id: "ultraguy_jump3",  src: "ultraguy_jump3.mp3"},
  //     {id: "ultraguy_jump4",  src: "ultraguy_jump4.mp3"},
  //     {id: "ultraguy_jump5",  src: "ultraguy_jump5.mp3"},
  //     {id: "ultraguy_hurt1",  src: "ultraguy_hurt1.mp3"},
  //     {id: "ultraguy_hurt2",  src: "ultraguy_hurt2.mp3"},
  //     {id: "ultraguy_hurt3",  src: "ultraguy_hurt3.mp3"},
  //     {id: "ultraguy_hurt4",  src: "ultraguy_hurt4.mp3"},
  //     {id: "ultraguy_hurt5",  src: "ultraguy_hurt5.mp3"},
  //     {id: "ultraguy_hurt6",  src: "ultraguy_hurt6.mp3"},
  //     {id: "ultraguy_death1", src: "ultraguy_death1.mp3"},
  //     {id: "ultraguy_death2", src: "ultraguy_death2.mp3"},
  //     {id: "ultraguy_death3", src: "ultraguy_death3.mp3"},
  //     {id: "ultraguy_death4", src: "ultraguy_death4.mp3"},
  //     {id: "ultraguy_death5", src: "ultraguy_death5.mp3"},
  //     {id: "ultraguy_death6", src: "ultraguy_death6.mp3"},
  //     {id: "ultraguy_death7", src: "ultraguy_death7.mp3"},
  //     {id: "ultraguy_start1", src: "ultraguy_start1.mp3"},
  //     {id: "ultraguy_start2", src: "ultraguy_start2.mp3"},
  //     {id: "ultraguy_start3", src: "ultraguy_start3.mp3"},
  //     {id: "ultraguy_start4", src: "ultraguy_start4.mp3"},
  //     {id: "ultraguy_start5", src: "ultraguy_start5.mp3"},
  //     {id: "ultraguy_start6", src: "ultraguy_start6.mp3"},
  //     {id: "ultraguy_start7", src: "ultraguy_start7.mp3"},
  //     {id: "ultraguy_start8", src: "ultraguy_start8.mp3"}
  //     ];

  //   createjs.Sound.addEventListener ("fileload", sound_loaded);
  //   createjs.Sound.registerSounds (sounds, "sounds/");
  //   }

  ////////////////////////////////////////////////////////////////////////////////

  // function sound_loaded (event)
  //   {
  //   createjs.Sound.removeEventListener ("fileload", sound_loaded);
  //   play_sound ("start");
  //   }

  ////////////////////////////////////////////////////////////////////////////////

  ultraguy.prototype.draw = function ()
    {
    var x, y;
    var animation, animation_frame;
    var frame_x, frame_y;
    var width, height;
    var sprite;

    if (game_state === INSTRUCTIONS) instructions_screen.draw (canvas_2d, 0, 0, 1.0);

    if (game_state === GAME)
      {
      // background
      sky.draw (canvas_2d, 0, 0, 1.0);

      // night background
      //solid_black.draw (canvas_2d, 0, 0, 1.0);

      // trippy background
      //sky.draw (canvas_2d, 0, 0, 0.1);

      // tiles
      for (var t = 0; t < tile_list.length; t += 1)
        {
        tiles_sprite.draw_part (canvas_2d, tile_list[t].source_x, tile_list[t].source_y, tilesize_x, tilesize_y, level_x_offset + tile_list[t].x, level_y_offset + tile_list[t].y, 1.0);
        }

      // bad guys
      for (var b = 0; b < badguy.length; b += 1)
        {
        animation = badguy[b].get_animation();
        animation_frame = animation.frame_list[badguy[b].frame_in_sequence];
        frame_x = animation_frame * (badguy[b].sprite_width + 4);
        frame_y = 0;
        if (badguy[b].facing === LEFT) frame_y = badguy[b].sprite_height + 4;
        if (badguy[b].type === DEALER)
          {
          dealer_sprite.draw_part (canvas_2d, frame_x, frame_y, badguy[b].sprite_width, badguy[b].sprite_height, badguy[b].x - (badguy[b].sprite_width / 2), badguy[b].y - badguy[b].sprite_height, badguy[b].opacity);
          if (badguy[b].blinking === true)
            {
            frame_x = 3 * (badguy[b].sprite_width + 4);
            dealer_sprite.draw_part (canvas_2d, frame_x, frame_y, badguy[b].sprite_width, badguy[b].sprite_height, badguy[b].x - (badguy[b].sprite_width / 2), badguy[b].y - badguy[b].sprite_height, badguy[b].opacity);
            }
          }
        }

      // player
      animation = player.get_animation();
      animation_frame = animation.frame_list[player.frame_in_sequence];

      if (player.action === DEATH || player.action === DEAD)
        {
        frame_x = 1116;
        frame_y = 164;
        ultraguy_sprite.draw_part (canvas_2d, frame_x, frame_y, player.sprite_width, player.tombstone_height, player.x - (player.sprite_width / 2), player.y - player.tombstone_height, 1.0);
        if (player.tombstone_height < player.sprite_height) player.tombstone_height += .8;
        }

      frame_x = animation_frame * (player.sprite_width + 4);
      frame_y = 0;

      if (animation_frame > 13)
        {
        frame_x = (animation_frame - 14) * (player.sprite_width + 4);
        frame_y += player.sprite_height + 4;
        }

      if (player.facing === LEFT) frame_y += 2 * (player.sprite_height + 4);

      ultraguy_sprite.draw_part (canvas_2d, frame_x, frame_y, player.sprite_width, player.sprite_height, player.x - (player.sprite_width / 2), player.y - player.sprite_height, player.opacity);
      if (player.blinking === true && (player.action === STANDING || player.action === WALKING))
        {
        frame_x = 1 * (player.sprite_width + 4);
        ultraguy_sprite.draw_part (canvas_2d, frame_x, frame_y, player.sprite_width, player.sprite_height, player.x - (player.sprite_width / 2), player.y - player.sprite_height, player.opacity);
        }

      // items
      for (var i = 0; i < item.length; i += 1)
        {
        animation = item[i].get_animation();
        animation_frame = animation.frame_list[item[i].frame_in_sequence];
        frame_x = animation_frame * (item[i].sprite_width + 4);
        frame_y = 0;
        if (item[i].type === BOMB) bomb_sprite.draw_part (canvas_2d, frame_x, frame_y, item[i].sprite_width, item[i].sprite_height, item[i].x - (item[i].sprite_width / 2), item[i].y - item[i].sprite_height, 1.0);
        }

      // explosions
      for (var e = 0; e < explosion.length; e += 1)
        {
        explosion_sprite.draw_scaled (canvas_2d, explosion[e].x - (explosion[e].size / 2), explosion[e].y - (explosion[e].size / 2), explosion[e].size, explosion[e].size, explosion[e].opacity);
        }

      // popups
      for (var p = 0; p < popup.length; p += 1)
        {
        if (popup[p].type === POINTS)
          {
          for (var d = 0; d < popup[p].number_array.length; d += 1)
            {
            frame_x = popup[p].number_array[d] * 20;
            points_sprite.draw_part (canvas_2d, frame_x, 0, 20, popup[p].height, popup[p].x + (d * 20), popup[p].y, popup[p].opacity);
            }
          }
        else
          {
          if (popup[p].type === BAM) sprite = bam_sprite;
          if (popup[p].type === POW) sprite = pow_sprite;
          if (popup[p].type === POP) sprite = pop_sprite;
          if (popup[p].type === WHAM) sprite = wham_sprite;
          if (popup[p].type === SLASH) sprite = slash_sprite;
          if (popup[p].type === BOOOM) sprite = booom_sprite;
          if (popup[p].type === KABOOM) sprite = kaboom_sprite;
          sprite.draw (canvas_2d, popup[p].x - (sprite.Width / 2), popup[p].y - (sprite.Height / 2), popup[p].opacity);
          }
        }

      // life hud
      solid_black.draw_part (canvas_2d, 0, 0, life_width, life_height, life_x, life_y, life_width, life_height, 1.0);
      lifebar_sprite.draw_part (canvas_2d, 0, 0, 36, life_height, life_x, life_y, 36, life_height, 1.0);

      var health_percentage = player.health / 100;
      width = Math.floor (124 * health_percentage);
      lifebar_sprite.draw_part (canvas_2d, 36, 0, width, life_height, life_x + 36, life_y, width, life_height, 1.0);

      // points hud
      solid_black.draw_part (canvas_2d, 0, 0, points_width, points_height, points_x, points_y, 1.0);
      var draw = false;
      for (var d = 0; d < points_array.length; d += 1)
        {
        if (points_array[d] !== 0) draw = true;
        frame_x = points_array[d] * 20;
        if (draw === true || d === points_array.length - 1) points_sprite.draw_part (canvas_2d, frame_x, 0, 20, points_height, points_x + (d * 20) + 6, points_y + 6, 1.0);
        }

      // buttons
      left_button_sprite.draw (canvas_2d, left_button.x, left_button.y, button_opacity);
      right_button_sprite.draw (canvas_2d, right_button.x, right_button.y, button_opacity);
      down_button_sprite.draw (canvas_2d, down_button.x, down_button.y, button_opacity);
      punch_button_sprite.draw (canvas_2d, punch_button.x, punch_button.y, button_opacity);
      jump_button_sprite.draw (canvas_2d, jump_button.x, jump_button.y, button_opacity);
      info_button_white.draw (canvas_2d, info_button.x, info_button.y, 1.0);

      if (reload_showing === true)
        {
        if (reload_version === 1) reload_sprite1.draw (canvas_2d, reload.x, reload.y, reload_opacity);
        if (reload_version === 2) reload_sprite2.draw (canvas_2d, reload.x, reload.y, reload_opacity);
        if (reload_version === 3) reload_sprite3.draw (canvas_2d, reload.x, reload.y, reload_opacity);
        }

      // test
      if (test_show === true)
        {
        test_sprite.draw (canvas_2d, 100, 100, 1.0);
        test_counter += 1;
        if (test_counter > test_delay)
          {
          test_show = false;
          test_counter = 0;
          }
        }

      for (var t = 0; t < touch_test.length; t += 1)
        {
        test2_sprite.draw (canvas_2d, touch_test[t].x, touch_test[t].y, touch_test[t].opacity);
        canvas_2d.font = "25px arial";
        canvas_2d.fillStyle = "#FFFFFF";
        canvas_2d.fillText (String (touch_test[t].x) + ", " + String (touch_test[t].y), touch_test[t].x + 10, touch_test[t].y);

        touch_test[t].opacity -= 0.001;
        if (touch_test[t].opacity < 0.0)
          {
          touch_test[t].opacity = 0.0;
          touch_test[t].active = false;
          }
        }

      t = 0;
      while (t < touch_test.length && touch_test.length > 0)
        {
        if (touch_test[t].active === false) touch_test.splice (t, 1);
        else t += 1;
        }
      }

    if (fade_direction != NONE)
      {
      canvas_2d.globalAlpha = fade_opacity;
      solid_black.draw (canvas_2d, 0, 0);
      canvas_2d.globalAlpha = 1.0;
      }
    }

  ////////////////////////////////////////////////////////////////////////////////

  }());
