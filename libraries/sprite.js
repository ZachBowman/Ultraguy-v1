(function ()
  {
  function LoaderProxy ()
    {
    return {draw: $.noop,
            fill: $.noop,
            frame: $.noop,
            update: $.noop,
            Width: null,
            Height: null
            };
    }

  function Sprite (image, sourceX, sourceY, Width, Height)
    {
    sourceX = sourceX || 0;
    sourceY = sourceY || 0;
    Width = Width || image.width;
    Height = Height || image.height;

    return {
    
      draw: function (canvas, x, y, opacity)
        {
        if (canvas != undefined)
          {
          if (opacity < 1.0) canvas.globalAlpha = opacity;
          canvas.drawImage (image, 0, 0, Width, Height, x, y, Width, Height);
          if (canvas.globalAlpha < 1.0) canvas.globalAlpha = 1.0;
          }
        },

      draw_part: function (canvas, source_x, source_y, source_width, source_height, dest_x, dest_y, opacity)
        {
        if (canvas != undefined)
          {
          if (opacity < 1.0) canvas.globalAlpha = opacity;
          canvas.drawImage (image, source_x, source_y, source_width, source_height, dest_x, dest_y, source_width, source_height);
          if (canvas.globalAlpha < 1.0) canvas.globalAlpha = 1.0;
          }
        },

      draw_scaled: function (canvas, x, y, width, height, opacity)
        {
        if (canvas != undefined)
          {
          if (opacity < 1.0) canvas.globalAlpha = opacity;
          canvas.drawImage (image, 0, 0, image.width, image.height, x, y, width, height);
          if (canvas.globalAlpha < 1.0) canvas.globalAlpha = 1.0;
          }
        },
        
      draw_part_scaled: function (canvas, source_x, source_y, source_width, source_height, dest_x, dest_y, dest_width, dest_height, opacity)
        {
        if (canvas != undefined)
          {
          if (opacity < 1.0) canvas.globalAlpha = opacity;
          canvas.drawImage (image, source_x, source_y, source_width, source_height, dest_x, dest_y, dest_width, dest_height);
          if (canvas.globalAlpha < 1.0) canvas.globalAlpha = 1.0;
          }
        },
      
      // fill: function(canvas, x, y, Width, Height, repeat)
      //   {
      //   if (canvas != undefined)
      //     {
      //     repeat = repeat || "repeat";
      //     var pattern = canvas.createPattern(image, repeat);
      //     canvas.fillColor(pattern);
      //     canvas.fillRect(x, y, Width, Height);
      //     }
      //   },
      
      Width: Width,
      Height: Height
      };
    };
  
  Sprite.load = function (url, loadedCallback)
    {
    var img = new Image();
    var proxy = LoaderProxy();
    
    img.onload = function()
      {
      var tile = Sprite(this);
      
      $.extend(proxy, tile);
      
      if(loadedCallback)
        {
        loadedCallback(proxy);
        }
      };
    
    img.src = url;
    
    return proxy;
    };
 
  var spriteImagePath = "images/";

  window.Sprite = function(name, callback)
    {
    return Sprite.load(spriteImagePath + name + ".png", callback);
    };
  window.Sprite.EMPTY = LoaderProxy();
  window.Sprite.load = Sprite.load;
  }());
