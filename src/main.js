/**
 * Created by gramp_000 on 3/2/14.
 */
var canvas;
	var stage;
    var tiles = [];
    var hero;
    //var moving = false;
    var speed = 1.5;
   // var wolf;

    var KEYCODE_ENTER = 13;
	var KEYCODE_SPACE = 32;
	var KEYCODE_UP = 38;
	var KEYCODE_LEFT = 37;
	var KEYCODE_RIGHT = 39;
	var KEYCODE_W = 87;
    var KEYCODE_S = 83;
	var KEYCODE_A = 65;
	var KEYCODE_D = 68;
    var KEYCODE_F = 70;

    var right = false, down = false;
    var counter = 0;
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;

	function init() {
	    canvas = document.getElementById('myCanvas');
	    width = canvas.width;
	    height = canvas.height;
        var  spawnOffset = -500;
	    stage = new createjs.Stage(canvas);
        hero = new Hero();
		hero.s.x = -spawnOffset + 400;
		hero.s.y = -spawnOffset + 400;
	   // stage.addChild(hero);

        stage.x = spawnOffset;
        stage.y = spawnOffset;

        var simplex = new SimplexNoise();
        var simplex2 = new SimplexNoise();

        var mapSize = 20;
        var tileCount = mapSize*mapSize;
        var xPos = 0, yPos = 0;

        for(var i=0;i< tileCount;i++){
            if(i % mapSize == 0){
                xPos = 0;
                yPos += 1;
            }
            else{
                xPos += 1;
            }
            var type;
            var blurNoise = simplex.noise2D(xPos/20, yPos/20) * 10;
            var landNoise = simplex.noise2D(xPos/8, yPos/8) * 15;
            var noise = simplex.noise2D(xPos, yPos) * 10;
            var decalNoise = simplex2.noise2D(xPos, yPos) * 10;
            var yOffset = 0;
            if(blurNoise > 4){
                type = 3;
                yOffset = 13;
            }
            else if(landNoise > 8){
                type = 4;
                //yOffset = 8 - landNoise;
            }
            else if(blurNoise > 3){
                type = 2;
            }
            else{
                type = 0;
                yOffset = landNoise;
            }
            var tile = new Tile(type);
           // tile.s.setTransform(0,0,1,1,noise/5,0,0,0,0);
            //tile.s.set({:0});
            tile.s.x = xPos * 50 + 400 + tile.xOffset;
            tile.s.y = yPos * 50 + 400 + yOffset;
            if(type != 3){
                if(decalNoise > 8){
                //chests
                //var decal = new Decal(0);
                //tile.AddDecal(decal);
                }
                else if(landNoise > 8){
                var decal = new Decal(2);
                //tile.AddDecal(decal);
                }
                else if(landNoise > 5){
                var decal = new Decal(3);
                tile.AddDecal(decal);
                }
                else if(noise > 3){
                var decal = new Decal(1);
               // tile.AddDecal(decal);
                }
            }
           // stage.update();
            tiles.push(tile);
        }
        //start game timer
		if (!createjs.Ticker.hasEventListener("tick")) {
			createjs.Ticker.addEventListener("tick", tick);
		}
        //createjs.Ticker.setInterval(1);
        createjs.Ticker.setFPS(60);
	    //stage.update();
	}

/*
	function Wolf() {
        this.anims = new createjs.SpriteSheet({
				"animations":
				{
					"down": [0, 2, "down", .1],
					"left": [3, 5, "left",.1],
                    "right": [6, 8, "right",.1],
                    "up": [9, 11, "up",.1]},

					"images": ["assets/wolf.png"],

					"frames":
						{
							"height": 37,
							"width":35,
							"regX": 0,
							"regY": 0,
							"count": 12

						}
		});
    }
*/




    //allow for WASD and arrow control scheme
	function handleKeyDown(e) {
		//cross browser issues exist
		if(!e){ var e = window.event; }
		switch(e.keyCode) {
			case KEYCODE_F:
                   // console.log("f");
                for(var i = 0; i < tiles.length; i++){
                    if(tiles[i].decal != null){
                        var tilex = tiles[i].s.x + stage.x;
                        var tiley = tiles[i].s.y + stage.y;
                        var distance = Math.sqrt(Math.pow( tilex - 400, 2) + Math.pow( tiley - 400, 2));
                        if(distance < 55){
                            tiles[i].UseDecal();
                        }
                    }
                }

                break;
            case KEYCODE_SPACE: hero.Jump(); break;
			case KEYCODE_A: hero.xVel = -speed; right = false; break;
			case KEYCODE_D: hero.xVel = speed;  right = true; break;
			case KEYCODE_W: hero.yVel = -speed; down = false; break;
            case KEYCODE_S: hero.yVel = speed; down = true;  break;
		}
	}

	function handleKeyUp(e) {
		//cross browser issues exist
		if(!e){ var e = window.event; }
		switch(e.keyCode) {


			case KEYCODE_A: if(!right) hero.xVel = 0; break;
			case KEYCODE_D: if(right) hero.xVel = 0; break;
			case KEYCODE_W: if(!down) hero.yVel = 0; break;
            case KEYCODE_S: if(down) hero.yVel = 0; break;
		}
	}


    function tick(event) {

       // stage.update();

        //stage.set({alpha:.6});
        //stage.set({rotation : 33});
        counter++;
        stage.removeAllChildren();
        var colH = false;
        var colV = false;
        hero.isDrawn = false;
        for(var i = 0; i < tiles.length; i++){
            var tilex = tiles[i].s.x + stage.x;
            var tiley = tiles[i].s.y + stage.y;
            var distance = Math.sqrt(Math.pow( tilex - 400, 2) + Math.pow( tiley - 400, 2));

            if(distance < 600){
                //if(tiles[i].type != 4){
                    stage.addChild(tiles[i].s);
                    tiles[i].Update();
                //}
            }
        }
        for(var i = 0; i < tiles.length; i++){
            var tilex = tiles[i].s.x + stage.x;
            var tiley = tiles[i].s.y + stage.y;
            var distance = Math.sqrt(Math.pow( tilex - 400, 2) + Math.pow( tiley - 450, 2));
            /*
             if(distance < 600 && hero.currentType == 4){
                if(tiles[i].type == 4){
                    stage.addChild(tiles[i].s);
                    tiles[i].Update();
                }
             }
            */

            if(distance < 50){
              if(!hero.isDrawn){
                stage.addChild(hero.shadow);
                stage.addChild(hero.s);
                hero.isDrawn = true;
              }
            }
            if(distance < 600){
                if(tiles[i].type == 4 && hero.currentType != 4){
                    //stage.addChild(tiles[i].s);
                   // tiles[i].Update();
                }
                if(tiles[i].decal != null){
                    stage.addChild(tiles[i].decal.s);
                    tiles[i].decal.Update();
                }
            }
        }
        var xOffset = 0;
        if(hero.dir == "right" && hero.currentType != 4){
            xOffset = 10;
        }
        else if(hero.dir == "left" && hero.currentType == 4){
            xOffset = 25;
        }
         for(var i = 0; i < tiles.length; i++){
                if(((hero.s.x + 18 < tiles[i].s.x + 50) &&
                    (hero.s.x + 18 > tiles[i].s.x - xOffset)) &&
                   ((hero.s.y + 45 < tiles[i].s.y + 75 + tiles[i].yOffset ) &&
                    (hero.s.y + 45 > tiles[i].s.y)))
                {
                    hero.currentType = tiles[i].type;
                    hero.yOffset = tiles[i].yOffset;
                }
         }
        for(var i = 0; i < tiles.length; i++){
           // if(tiles[i].type == 1 || tiles[i].decal || (tiles[i].type == 3 && !hero.jumping) || (tiles[i].type == 4 && !hero.jumping) && hero.currentType != 4){
           if(tiles[i].type == 1 || (tiles[i].type == 3 && !hero.jumping) ||
               tiles[i].type == 4 && hero.currentType != 4 && !hero.jumping || hero.falling){
                if(((hero.s.x + hero.xVel < tiles[i].s.x + 40) &&
                    (hero.s.x + hero.xVel > tiles[i].s.x - 40)) &&
                   ((hero.s.y < tiles[i].s.y + 15 ) &&
                    (hero.s.y > tiles[i].s.y - 50 )))
                {
                    colH = true;
                }
                if(((hero.s.x < tiles[i].s.x + 40) &&
                    (hero.s.x > tiles[i].s.x - 40)) &&
                   ((hero.s.y + hero.yVel  < tiles[i].s.y + 15 ) &&
                    (hero.s.y + hero.yVel > tiles[i].s.y - 50 )))
                {
                   colV = true;
                }
            }
        }
       // hero.colV = colV;
       // hero.colH = colH;
        if(!hero.falling)
        {
            if(!colH){
                hero.s.x += hero.xVel;
                stage.x -= hero.xVel;
            }


            if(!colV){
                hero.s.y += hero.yVel;
                stage.y -= hero.yVel;
            }
        }
        else{
                hero.s.x += hero.xVel;
                stage.x -= hero.xVel;
                hero.s.y += hero.yVel;
                stage.y -= hero.yVel;
        }


        //var bmp = new createjs.Bitmap("assets/pine.png");
        /*
        bmp.image.onLoad = function () {
                 var redFilter = new createjs.ColorFilter(1,0,0,1);
                 bmp.filters = [redFilter];
                 bmp.cache(0, 0, this.width, this.height);
                 stage.addChild(bmp);
        }
        */
        //bmp.x = 0;
        //bmp.y = 0;
        //console.log(bmp.width.x + " " + bmp.height);
        // Cache it
       // console.log(hero.currentType);

        hero.Update();
        // Apply a filter
       // var redFilter = new createjs.ColorFilter(1,0,0,1);
       // bmp.filters = [redFilter];
       // bmp.cache(bmp.x,bmp.y,bmp.width,bmp.height);
        // Add to stage
       // stage.addChild(bmp);
        stage.update();
    }