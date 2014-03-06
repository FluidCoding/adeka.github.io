/**
 * Created by gramp_000 on 3/2/14.
 */
var canvas;
	var stage;
    var tiles = [];
    var units = [];
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
    var mapSize = 20;
    var right = false, down = false;
    var counter = 0;
    var chunk;
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;

	function init() {
        canvas = document.getElementById('myCanvas');
	    width = canvas.width;
	    height = canvas.height;
        var  spawnOffset = -500;
	    stage = new createjs.Stage(canvas);
        hero = new Hero();
        //hero.rootStage = stage;
		hero.s.x = -spawnOffset + 400;
		hero.s.y = -spawnOffset + 400;
	   // stage.addChild(hero);
        units.push(hero);
        var b = new NPC("bunny");
		b.s.x = -spawnOffset + 400;
		b.s.y = -spawnOffset + 400;
        //units.push(b);

        stage.x = spawnOffset;
        stage.y = spawnOffset;
        chunk = new Chunk();
    }

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
       chunk.Update();
       stage.update();
    }

 function Chunk(){


        var simplex = new SimplexNoise();
        var simplex2 = new SimplexNoise();


        var tileCount = mapSize*mapSize;
        var xPos = 0, yPos = 0;

        for(var i=0;i< tileCount;i++){
            var bunnyChance = Math.random()*1000;
            var wolfChance = Math.random()*1000;
            var deerChance = Math.random()*1000;
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

            if(!tile.decal){
               if(bunnyChance > 988){
                    var bunny = new NPC("bunny");
                    bunny.s.x = tile.s.x;
                    bunny.s.y = tile.s.y;
                    units.push(bunny);
                }
                else if(deerChance > 988){
                    var deer = new NPC("deer");
                    deer.s.x = tile.s.x;
                    deer.s.y = tile.s.y;
                    units.push(deer);
                }
                else if(wolfChance > 988){
                    var deer = new NPC("wolf");
                    deer.s.x = tile.s.x;
                    deer.s.y = tile.s.y;
                    units.push(deer);
                }
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

 Chunk.prototype.Update = function() {
        counter++;
        this.SetUnitTiles();
        this.CheckUnitDecalCollision();
        this.CheckUnitTileCollision();
        this.CenterScreen();
        this.UpdateUnits();
             this.Draw();

        stage.update();
    }
Chunk.prototype.UpdateUnits = function(){
    for(var i = 0; i < units.length; i++){
        units[i].Update();
        if(units[i] instanceof NPC){
            units[i].Wander();
        }
    }
}
Chunk.prototype.Draw = function(){
        stage.removeAllChildren();
        //draw everything in the right order
        for(var i = 0; i < tiles.length; i++){
            var tilex = tiles[i].s.x + stage.x;
            var tiley = tiles[i].s.y + stage.y;
            var distance = Math.sqrt(Math.pow( tilex - 400, 2) + Math.pow( tiley - 450, 2));
            if(distance < 650){
            stage.addChild(tiles[i].s);
            tiles[i].Update();
                this.DrawUnits(tiles[i]);
                if(tiles[i].decal != null){
                    stage.addChild(tiles[i].decal.s);
                    tiles[i].decal.Update();
                }
            }
        }
}
Chunk.prototype.DrawUnits = function(tile){
    for(var i = 0; i < units.length; i++){
        units[i].Draw(tile, stage);
    }
}
Chunk.prototype.SetUnitTiles = function(){
        //detect the tile directly underneath the hero
         for(var i = 0; i < tiles.length; i++){
             for(var j = 0; j < units.length; j++){
                  units[j].CheckTilePair(tiles[i], tiles[i+1]);
             }
         }
}
Chunk.prototype.CheckUnitDecalCollision = function(){
        //decal collisions
        for(var i = 0; i < tiles.length; i++){
             if( tiles[i].decal ){
                 for(var j = 0; j < units.length; j++){
                     units[j].CheckDecalCollision(tiles[i]);
                 }
            }
        }
}
Chunk.prototype.CheckUnitTileCollision = function(){
        //tile collision
        for(var i = 0; i < tiles.length; i++){
             for(var j = 0; j < units.length; j++){
                units[j].CheckTileCollision(tiles[i]);
             }
        }
}
Chunk.prototype.CenterScreen = function(){
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
}