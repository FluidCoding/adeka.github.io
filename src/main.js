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
    var mapSize = 50;
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
        hero.rootStage = stage;
		hero.s.x = -spawnOffset + 400;
		hero.s.y = -spawnOffset + 400;
	   // stage.addChild(hero);

        stage.x = spawnOffset;
        stage.y = spawnOffset;

        var simplex = new SimplexNoise();
        var simplex2 = new SimplexNoise();


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

            tile.s.x = xPos * 50 + 400 + tile.xOffset;
            tile.s.y = yPos * 50 + 400 + yOffset;
            if(type != 3){
                //if(decalNoise > 8){
                //chests
                //var decal = new Decal(0);
                //tile.AddDecal(decal);
                //}
                //if(landNoise > 8){
                //var decal = new Decal(2);
                //tile.AddDecal(decal);
                //}
                //if(landNoise > 5){
                //var decal = new Decal(3);
                //tile.AddDecal(decal);
                //}
                if(noise > 4){
                var decal = new Decal(1);
                tile.AddDecal(decal);
                }
                else if(noise > 3){
                var decal = new Decal(3);
                tile.AddDecal(decal);
                }
            }
           // stage.update();
            tiles.push(tile);
        }
        //start game timer
		if (!createjs.Ticker.hasEventListener("tick")) {
			createjs.Ticker.addEventListener("tick", tick);
		}
        createjs.Ticker.setInterval(1);
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
			case KEYCODE_A: hero.xVel = -hero.speed; right = false; break;
			case KEYCODE_D: hero.xVel = hero.speed;  right = true; break;
			case KEYCODE_W: hero.yVel = -hero.speed; down = false; break;
            case KEYCODE_S: hero.yVel = hero.speed; down = true;  break;
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

    //main update loop
    function tick(event) {
        counter++;
        stage.removeAllChildren();
        hero.isDrawn = false;

        //define collision offset based on current direction
        var xOffset = 0;
        if(hero.dir == "right" && hero.currentType != 4){
            xOffset = 10;
        }
        else if(hero.dir == "left" && hero.currentType == 4){
            xOffset = 25;
        }

        //decal collisions
        for(var i = 0; i < tiles.length; i++){
             if( tiles[i].decal ){
                var dx = tiles[i].decal.s.x - tiles[i].decal.xOffset;
                var dy = tiles[i].decal.s.y - tiles[i].decal.yOffset - 25 + tiles[i].yOffset;
                var hx = hero.s.x;
                var hy = hero.s.y;
                var vhx = hero.s.x + hero.xVel;
                var vhy = hero.s.y + hero.yVel;
                var distance = Math.sqrt(Math.pow( dx - hx, 2) + Math.pow( dy - hy, 2));
                var xdistance = Math.sqrt(Math.pow( dx - vhx, 2) + Math.pow( dy - hy, 2));
                var ydistance = Math.sqrt(Math.pow( dx - hx, 2) + Math.pow( dy - vhy, 2));
                 if(xdistance < 25){
                     hero.colH = true;
                 }
                 if(ydistance < 25){
                     hero.colV = true;
                 }
                 if(distance <= 25){
                     //caught
                      hero.s.y += 2;
                 }
            }
        }

        //detect the tile directly underneath the hero
         for(var i = 0; i < tiles.length; i++){
                if(((hero.s.x + 18 < tiles[i].s.x + 50) &&
                    (hero.s.x + 18 > tiles[i].s.x - xOffset)) &&
                   ((hero.s.y + 45 < tiles[i].s.y + 75 + tiles[i].yOffset ) &&
                    (hero.s.y + 45 > tiles[i].s.y )))
                {
                    hero.currentType = tiles[i].type;
                    hero.currentTile = tiles[i];
                    hero.nextTile = tiles[i + 1]
                    hero.yOffset = tiles[i].yOffset;
                }
         }

        //tile collision
        for(var i = 0; i < tiles.length; i++){
            //(tiles[i].type == 4 && hero.currentType != 4 && !hero.jumping || hero.falling) ||
           if((tiles[i].type == 3 && !hero.jumping && !hero.drowning) ||
               (tiles[i].type == 4 && hero.currentType != 4 && !hero.jumping || hero.falling) ||
               (tiles[i].decal && hero.jumping)){
                if(((hero.s.x + hero.xVel < tiles[i].s.x + 32) &&
                    (hero.s.x + hero.xVel > tiles[i].s.x - 32)) &&
                   ((hero.s.y < tiles[i].s.y + 15 ) &&
                    (hero.s.y > tiles[i].s.y - 50 )))
                {
                    hero.colH = true;
                }
                if(((hero.s.x < tiles[i].s.x + 32) &&
                    (hero.s.x > tiles[i].s.x - 32)) &&
                   ((hero.s.y + hero.yVel  < tiles[i].s.y + 15 ) &&
                    (hero.s.y + hero.yVel > tiles[i].s.y - 50 )))
                {
                   hero.colV = true;
                }
            }
        }

        //move screen to center on hero
        if(-stage.x < hero.s.x - 400){
           stage.x-= hero.speed;
        }
        if(-stage.y < hero.s.y - 400){
           stage.y-= hero.speed;
        }
        if(-stage.x > hero.s.x - 400){
           stage.x+= hero.speed;
        }
        if(-stage.y > hero.s.y - 400){
           stage.y+= hero.speed;
        }

        //draw everything in the right order
        for(var i = 0; i < tiles.length; i++){
            var tilex = tiles[i].s.x + stage.x;
            var tiley = tiles[i].s.y + stage.y;
            var distance = Math.sqrt(Math.pow( tilex - 400, 2) + Math.pow( tiley - 450, 2));

            if(distance < 650){
            stage.addChild(tiles[i].s);
            tiles[i].Update();
                if(tiles[i] == hero.nextTile){
                  if(!hero.isDrawn){
                    stage.addChild(hero.shadow);
                    stage.addChild(hero.s);
                    hero.isDrawn = true;
                  }
                }
                var n = i;
                if(tiles[n].decal != null){
                    stage.addChild(tiles[n].decal.s);
                    tiles[n].decal.Update();
                }
            }
        }
        hero.Update();
        stage.update();
    }