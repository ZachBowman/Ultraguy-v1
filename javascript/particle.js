// Particle
// Zach Bowman
// 2007 Nightmare Games
// 2015 Burning Freak Games

function Particle ()  // one individual particle
  {
  this.pos = new Vector2();    // x, y screen position
  this.dir = 0;          // degrees
  this.velocity = 0;
  this.acceleration = 0;
  this.fade = 0;        // alpha transparency
  this.fade_speed = 0;
  this.gravity = 0;
  this.gravity_accelerated = 0;
  this.sprite;
  this.alive = false;
  }
