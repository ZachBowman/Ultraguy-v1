// // The Fade
// // Zach Bowman
// // 2010 Nightmare Games

// using System;
// using System.IO;
// using System.Collections.Generic;
// using System.Linq;
// using System.Runtime.InteropServices;
// using Microsoft.Xna.Framework;
// using Microsoft.Xna.Framework.Audio;
// using Microsoft.Xna.Framework.Content;
// using Microsoft.Xna.Framework.GamerServices;
// using Microsoft.Xna.Framework.Graphics;
// using Microsoft.Xna.Framework.Input;
// using Microsoft.Xna.Framework.Media;
// //using Microsoft.Xna.Framework.Net;
// //using Microsoft.Xna.Framework.Storage;

// namespace Blockhead
//   {
//   public class Fade
//     {
//     public bool activated = false;
//     public bool running = false;
//     double currentfade;
//     double stopfade;
//     double speed;

//     public void init(int init_startfade, int init_stopfade, double init_speed)
//       {
//       activated = true;
//       running = true;
//       currentfade = init_startfade;
//       stopfade = init_stopfade;
//       speed = init_speed;
//       }

//     public void fade (SpriteBatch spriteBatch, Texture2D sprite, Vector2 v)
//       {
//       if (activated == true)
//         {
//         if (currentfade < stopfade + speed && currentfade > stopfade - speed)
//           {
//           currentfade = stopfade;
//           running = false;
//           }
//         if (currentfade > stopfade) currentfade -= speed;
//         if (currentfade < stopfade) currentfade += speed;
//         if (currentfade < 0) currentfade = 0;
//         if (currentfade > 255) currentfade = 255;

//         float temp_fade = Convert.ToSingle(currentfade / 255);

//         if (currentfade > 0) spriteBatch.Draw(sprite, v, Color.White * temp_fade); //new Color(Color.White, Convert.ToByte(currentfade)));
//         }
//       }

//     public void reset()
//       {
//       activated = false;
//       running = false;
//       speed = 0;
//       }
//     }
//   }
