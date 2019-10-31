// Particle Effect Engine
// Zach Bowman
// 2007 Nightmare Games
// 2015 Burning Freak Games

function Particle_Effect ()
  {
  this.screen_width = 0;
  this.screen_height = 0;
  this.active = false;  // are any particles still visible
  this.particle = [];

  ////////////////////////////////////////////////////////////////////////////////

  // create
  this.create = function (sprite, amount, xorigin, yorigin, screen_w, screen_h, direction, spread,
    avg_velocity, velocity_range, acceleration, fade, fade_speed, gravity)
    {
    var temp;
    this.active = true;
    this.screen_width  = screen_w;
    this.screen_height = screen_h;
    if (amount > 200) amount = 200;  // max particles per effect

    for (var p = 0; p < amount; p += 1)
      {
      var particle = new Particle();
      particle.sprite = sprite;
      particle.pos.X = xorigin;
      particle.pos.Y = yorigin;
      temp = Math.round (Math.random() * spread) + direction - (spread / 2);
      particle.dir = temp * -1;
      if (particle.dir >= 360) particle.dir -= 360;
      if (particle.dir < 0) particle.dir += 360;
      
      if (velocity_range == 0) particle.velocity = avg_velocity;
      else particle.velocity = (Math.random () * velocity_range) + (avg_velocity - (velocity_range / 2));
      if (particle.velocity < 0) particle.velocity = 0;

      particle.acceleration = acceleration;
      particle.fade = fade;
      particle.fade_speed = fade_speed;
      particle.gravity = gravity;
      particle.gravity_accelerated = 0;

      this.particle.push (particle);
      }
    }

  ////////////////////////////////////////////////////////////////////////////////

  // update
  this.update = function ()
    {
    var xmove, ymove;
    var alive;

    if (this.particle.length > 0) this.active = true;
    else this.active = false;

    var p = 0;
    while (p < this.particle.length)
      {
      alive = true;

      xmove = this.particle[p].velocity * Math.cos (to_radians (this.particle[p].dir));
      ymove = this.particle[p].velocity * Math.sin (to_radians (this.particle[p].dir));

      this.particle[p].pos.X += xmove;
      this.particle[p].pos.Y += ymove;

           if (this.particle[p].pos.X < 0)             alive = false;
      else if (this.particle[p].pos.X > screen_width)  alive = false;
      else if (this.particle[p].pos.Y < 0)             alive = false;
      else if (this.particle[p].pos.Y > screen_height) alive = false;
    
      // accelerate / decelerate
      this.particle[p].velocity += this.particle[p].acceleration;
      if (this.particle[p].velocity < 0) this.particle[p].velocity = 0;

      // gravity
      this.particle[p].gravity_accelerated += this.particle[p].gravity;
      //this.particle[p].pos_double_y += this.particle[p].gravity_accelerated;
      this.particle[p].pos.Y += this.particle[p].gravity_accelerated;

      // fade (transparency)
      this.particle[p].fade += this.particle[p].fade_speed;
      if (this.particle[p].fade <= 0) alive = false;

      if (!alive) this.particle.splice (p, 1);
      else p += 1;
      }
    }

  ////////////////////////////////////////////////////////////////////////////////

  // draw
  this.draw = function ()
    {
    for (var p = 0; p < this.particle.length; p += 1)
      {
      var temp_fade = this.particle[p].fade / 255;
      this.particle[p].sprite.draw (canvas_2d, this.particle[p].pos, temp_fade);
      }
    }
  }
