// Ultraguy
// Nightmare Games 2018
// Zach Bowman

////////////////////////////////////////////////////////////////////////////////

var mouse_x = 0;
var mouse_y = 0;
var click = new Click();
var left_mouse_button_down = false;

var key_left = false;
var key_right = false;
var key_down = false;
var key_punch = false;
var key_jump = false;
var key_jumpdown = false;

////////////////////////////////////////////////////////////////////////////////

function handleClick()
  {
	canvas_html.onclick = null;
	}

////////////////////////////////////////////////////////////////////////////////

function mouse_move (e, canvas_html)
  {
  if (!e) var e = event;
  if (!canvas_html) canvas_html = document.getElementById ("canvas");

  if (canvas_html)
    {
    mouse_x = e.pageX - canvas_html.offsetLeft;
    mouse_y = e.pageY - canvas_html.offsetTop;
    }

  if (left_mouse_button_down === true)
    {
    key_left = false;
    key_right = false;

    click.x = mouse_x;
    click.y = mouse_y;

    if (click_over (click, left_button, left_button_sprite)) key_left = true;
    if (click_over (click, right_button, right_button_sprite)) key_right = true;
    }
  }

////////////////////////////////////////////////////////////////////////////////

function mouse_down (mouse_x, mouse_y)
  {
  click.x = Math.floor (mouse_x / screen_size_ratio);
  click.y = Math.floor (mouse_y / screen_size_ratio);

  left_mouse_button_down = true;

  if (game_state === TITLE)
    {
    if (click_over (click, info_button, info_button_black))
      {
      show_instructions();
      }
    else if (sound_loaded_flag === true) title_screen_click();
    }

  else if (game_state === INSTRUCTIONS)
    {
    if (game_active === true) transition = GAME;
    else transition = TITLE;
    fadeout();
    }

  else if (game_state === GAME)
    {
    if (click_over (click, left_button, left_button_sprite) && key_left === false) key_left = true;
    if (click_over (click, right_button, right_button_sprite) && key_right === false) key_right = true;
    if (click_over (click, punch_button, punch_button_sprite) && key_punch === false) punch_button_pressed();
    if (click_over (click, jump_button, jump_button_sprite) && key_jump === false) jump_button_pressed();
    if (click_over (click, down_button, down_button_sprite) && key_jumpdown === false) jumpdown_button_pressed();
    if (click_over (click, reload, reload_sprite1) && reload_showing === true) new_game();
    if (click_over (click, info_button, info_button_white) && game_state === GAME) show_instructions();
    }
  }
  
////////////////////////////////////////////////////////////////////////////////

function mouse_up ()
  {
  left_mouse_button_down = false;

  key_left = false;
  key_right = false;
  key_punch = false;
  key_jump = false;
  key_jumpdown = false;
  }

////////////////////////////////////////////////////////////////////////////////

function touch_start (event)
  {
  //if (game_state === GAME)
  event.preventDefault();
  button_opacity = 1.0;
  var touch = event.touches;

  key_left = false;
  key_right = false;
  key_punch = false;
  key_jump = false;
  key_jumpdown = false;

  for (var t = 0; t < touch.length; t += 1)
    {
    click.x = Math.floor (touch[t].clientX / screen_size_ratio);
    click.y = Math.floor (touch[t].clientY / screen_size_ratio);

    if (game_state === TITLE)
      {
      if (click_over (click, info_button, info_button_black)) show_instructions();
      else if (sound_loaded_flag === true) title_screen_click();
      }
    else if (game_state === INSTRUCTIONS)
      {
      if (game_active === true) transition = GAME;
      else transition = TITLE;
      fadeout();
      }
    else if (game_state === GAME)
      {
      if (click_over (click, left_button, left_button_sprite)) key_left = true;
      if (click_over (click, right_button, right_button_sprite)) key_right = true;
      if (click_over (click, punch_button, punch_button_sprite) && key_punch === false) punch_button_pressed();
      if (click_over (click, jump_button, jump_button_sprite) && key_jump === false) jump_button_pressed();
      if (click_over (click, down_button, down_button_sprite) && key_jumpdown === false) jumpdown_button_pressed();
      if (click_over (click, reload, reload_sprite1) && reload_showing === true) new_game();
      if (click_over (click, info_button, info_button_black) && game_state === TITLE) show_instructions();
      if (click_over (click, info_button, info_button_white) && game_state === GAME) show_instructions();
      }
    }
  }

////////////////////////////////////////////////////////////////////////////////

function touch_move (event)
  {
  if (game_state === GAME) event.preventDefault();
  button_opacity = 1.0;
  var touch = event.touches;

  key_left = false;
  key_right = false;
  key_punch = false;
  key_jump = false;
  key_jumpdown = false;

  for (var t = 0; t < touch.length; t += 1)
    {
    click.x = Math.floor (touch[t].clientX / screen_size_ratio);
    click.y = Math.floor (touch[t].clientY / screen_size_ratio);

    if (click_over (click, left_button, left_button_sprite)) key_left = true;
    if (click_over (click, right_button, right_button_sprite)) key_right = true;
    if (click_over (click, punch_button, punch_button_sprite) && key_punch === false) punch_button_pressed();
    if (click_over (click, jump_button, jump_button_sprite) && key_jump === false) jump_button_pressed();
    if (click_over (click, down_button, down_button_sprite) && key_jumpdown === false) jumpdown_button_pressed();
    }
  }

////////////////////////////////////////////////////////////////////////////////

function touch_end (event)
  {
  if (game_state === GAME) event.preventDefault();
  button_opacity = 1.0;
  var touch = event.touches;

  key_left = false;
  key_right = false;
  key_punch = false;
  key_jump = false;

  for (var t = 0; t < touch.length; t += 1)
    {
    click.x = Math.floor (touch[t].clientX / screen_size_ratio);
    click.y = Math.floor (touch[t].clientY / screen_size_ratio);

    if (click_over (click, left_button, left_button_sprite)) key_left = true;
    if (click_over (click, right_button, right_button_sprite)) key_right = true;
    if (click_over (click, punch_button, punch_button_sprite)) key_punch = true;
    if (click_over (click, jump_button, jump_button_sprite)) key_jump = true;
    if (click_over (click, down_button, down_button_sprite)) key_jumpdown = true;
    }
  }

////////////////////////////////////////////////////////////////////////////////

// checks if click is over object's sprite

function click_over (click, object, object_sprite)
  {
  if (click.x >= object.x && click.x <= object.x + object_sprite.Width
      && click.y >= object.y && click.y <= object.y + object_sprite.Height) return true;

  else return false;
  }

////////////////////////////////////////////////////////////////////////////////

function keyboard_down (event)
  {
  if ((event.keyIdentifier === "Left" || event.key === "ArrowLeft" || event.key === "a") && key_left === false) key_left = true;
  if ((event.keyIdentifier === "Right" || event.key === "ArrowRight" || event.key === "d") && key_right === false) key_right = true;
  if ((event.keyIdentifier === "Down" || event.key === "ArrowDown" || event.key === "s") && key_down === false) key_down = true;
  if ((event.code === "ControlLeft" || event.code === "ControlRight" || event.key === "Control" || event.key === "k" || event.key === "K") && key_punch === false) punch_button_pressed();
  if ((event.key === " " || event.keyCode === 32 || event.key === "j" || event.key === "J") && key_jump === false) jump_button_pressed();
  }

////////////////////////////////////////////////////////////////////////////////

function keyboard_up (event)
  {
  if ((event.keyIdentifier === "Left" || event.key === "ArrowLeft" || event.key === "a" || event.key === "A") && key_left === true) key_left = false;
  if ((event.keyIdentifier === "Right" || event.key === "ArrowRight" || event.key === "d" || event.key === "D") && key_right === true) key_right = false;
  if ((event.keyIdentifier === "Down" || event.key === "ArrowDown" || event.key === "s" || event.key === "S") && key_down === true) key_down = false;
  if ((event.code === "ControlLeft" || event.key === "Control" || event.key === "k" || event.key === "K") && key_punch === true) key_punch = false;
  if ((event.key === " " || event.keyCode === 32 || event.key === "j" || event.key === "J") && key_jump === true) key_jump = false;
  }

////////////////////////////////////////////////////////////////////////////////

function keyboard_input ()
  {
  // movement
  if (key_left && key_right)
    {
    if (player.action !== STANDING && player.action !== HURT) player.change_action (STANDING);
    player.x_velocity = 0;
    }
  else if (key_left && !key_right)
    {
    if (player.active === true)
      {
      player.x_velocity = -player.walking_speed;
      if (player.facing !== LEFT) player.facing = LEFT;
      if (player.on_ground === true && player.action !== WALKING && player.action !== ATTACKING1 && player.action !== ATTACKING2 && player.action !== HURT) player.change_action (WALKING);
      if (player.on_ground === false && player.action !== JUMPING && player.action !== ATTACKING3 && player.action !== ATTACKING4 && player.action !== HURT) player.change_action (JUMPING);
      }
    }
  else if (key_right && !key_left)
    {
    if (player.active === true)
      {
      player.x_velocity = player.walking_speed;
      if (player.facing !== RIGHT) player.facing = RIGHT;
      if (player.on_ground === true && player.action !== WALKING && player.action !== ATTACKING1 && player.action !== ATTACKING2 && player.action !== HURT) player.change_action (WALKING);
      if (player.on_ground === false && player.action !== JUMPING && player.action !== ATTACKING3 && player.action !== ATTACKING4 && player.action !== HURT) player.change_action (JUMPING);
      }
    }
  else if (!key_left && !key_right)
    {
    player.x_velocity = 0;
    if (player.action === WALKING && player.action !== HURT) player.change_action (STANDING);
    }
  }

////////////////////////////////////////////////////////////////////////////////

function punch_button_pressed ()
  {
  key_punch = true;

  if (player.active === true && player.on_ground === true)
    {
    if (player.next_punch === RIGHT)
      {
      player.change_action (ATTACKING1);
      player.next_punch = LEFT;
      }
    else
      {
      player.change_action (ATTACKING2);
      player.next_punch = RIGHT;
      }
    }
  if (player.active === true && player.on_ground === false)
    {
    if (player.next_punch === RIGHT)
      {
      player.change_action (ATTACKING3);
      player.next_punch = LEFT;
      }
    else
      {
      player.change_action (ATTACKING4);
      player.next_punch = RIGHT;
      }
    check_for_player_punch();
    }
  }

////////////////////////////////////////////////////////////////////////////////

function jump_button_pressed ()
  {
  key_jump = true;

  if (player.active === true && player.on_ground === true)
    {
    if (key_down === true)
      {
      check_jump_down (player);
      }
    else
      {
      player.change_action (JUMPING);
      player.y_velocity = -15;
      play_sound ("ultraguy jump");
      }
    }
  }

////////////////////////////////////////////////////////////////////////////////

function jumpdown_button_pressed ()
  {
  key_jumpdown = true;

  if (player.active === true && player.on_ground === true) check_jump_down (player);
  }

////////////////////////////////////////////////////////////////////////////////
