/**
 * Created by gramp_000 on 3/2/14.
 */
var canvas;
var stage;
var hero;
//var moving = false;

// var wolf;
var allUnits = [];
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
var KEYCODE_I = 73;
var right = false, down = false, isInvShown = false;
var counter = 0;
var chunks = [];
var simplex = new SimplexNoise();
var simplex2 = new SimplexNoise();
var mapSize = 10;
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;
function init() {
    canvas = document.getElementById('myCanvas');
    width = canvas.width;
    height = canvas.height;
    var spawnOffset = -200;
    stage = new createjs.Stage(canvas);
    //hero = new NPC("deer");
    hero = new Hero();
    //hero.rootStage = stage;
    hero.s.x = -spawnOffset + 400;
    hero.s.y = -spawnOffset + 400;
    // stage.addChild(hero);
   // units.push(hero);
   // var b = new NPC("bunny");
   // b.s.x = -spawnOffset + 400;
    //b.s.y = -spawnOffset + 400;
    //units.push(b);
    allUnits.push(hero);
    stage.x = spawnOffset;
    stage.y = spawnOffset;


    var chunkCount = mapSize*mapSize;
    var xOrigin = -10, yOrigin = -10;
    for(var i = 0; i < chunkCount; i++){
        if (i % mapSize == 0) {
            xOrigin = -10;
            yOrigin += 10;
        }
        else {
            xOrigin += 10;
        }
        var chunk = new Chunk(stage, simplex, simplex2, xOrigin, yOrigin);
        if(i>0){
            chunks[i-1].nextChunk = chunk;
        }
        chunks.push(chunk);

    }

        //start game timer
    if (!createjs.Ticker.hasEventListener("tick")) {
        createjs.Ticker.addEventListener("tick", tick);
    }
    createjs.Ticker.setInterval(1);
    createjs.Ticker.setFPS(60);
    //stage.update();
// chunks[0].units.push(allUnits[0]);
}

//main update loop
function tick(event) {
   // console.log(chunks.length*chunks[0].tiles.length);
     counter++;

    for(var j = 0; j < allUnits.length; j++){
         allUnits[j].Update();
    }
    for(var i = 0; i < chunks.length; i++){
        for(var j = 0; j < allUnits.length; j++){
            if(chunks[i].ContainsUnit(allUnits[j])){
               if(!chunks[i].units.contains(allUnits[j])){
                 chunks[i].units.push(allUnits[j]);
                 //console.log("pushing");
               }
               if(allUnits[j] instanceof Hero && allUnits[j].updated == false){

                    //draw top and adjacent chunks
                    if(i - this.mapSize >= 0) chunks[i - mapSize].Update();
                    if(i - this.mapSize + 1 >= 0) chunks[i - mapSize + 1].Update();
                    if(i - this.mapSize - 1 >= 0) chunks[i - mapSize - 1].Update();

                   //draw current and adjacent chunks
                    if(i - 1 >= 0) chunks[i-1].Update();
                    chunks[i].Update();
                    if(i + 1 < chunks.length - 1) chunks[i+1].Update();

                   //draw bottom and adjacent chunks
                    if(i + this.mapSize - 1 < chunks.length - 1) chunks[i + mapSize - 1].Update();
                    if(i + this.mapSize < chunks.length - 1) chunks[i + mapSize].Update();
                    if(i + this.mapSize + 1 < chunks.length - 1) chunks[i + mapSize + 1].Update();



               }
            }
            else{
                if(chunks[i].units.contains(allUnits[j])){
                    chunks[i].units = [];
                }
            }
        }


    }
    if(isInvShown)
        ShowInventory();
    stage.update();
    CenterScreen();
    stage.removeAllChildren();
}

//allow for WASD and arrow control scheme
function handleKeyDown(e) {
    //cross browser issues exist
    if (!e) {
        var e = window.event;
    }
    switch (e.keyCode) {
        case KEYCODE_F:
            /*
            for (var i = 0; i < tiles.length; i++) {
                if (tiles[i].decal != null) {
                    var tilex = tiles[i].s.x + stage.x;
                    var tiley = tiles[i].s.y + stage.y;
                    var distance = Math.sqrt(Math.pow(tilex - 400, 2) + Math.pow(tiley - 400, 2));
                    if (distance < 55) {
                        tiles[i].UseDecal();
                    }
                }
            }
            */
            break;
        case KEYCODE_SPACE:
            hero.Jump();
            break;
        case KEYCODE_A:
            hero.xVel = -hero.speed;
            right = false;
            break;
        case KEYCODE_D:
            hero.xVel = hero.speed;
            right = true;
            break;
        case KEYCODE_W:
            hero.yVel = -hero.speed;
            down = false;
            break;
        case KEYCODE_S:
            hero.yVel = hero.speed;
            down = true;
            break;
    }
}

function handleKeyUp(e) {
    //cross browser issues exist
    if (!e) {
        var e = window.event;
    }
    switch (e.keyCode) {
        case KEYCODE_A:
            if (!right) hero.xVel = 0;
            break;
        case KEYCODE_D:
            if (right) hero.xVel = 0;
            break;
        case KEYCODE_W:
            if (!down) hero.yVel = 0;
            break;
        case KEYCODE_S:
            if (down) hero.yVel = 0;
            break;
        case KEYCODE_I:
            if(!isInvShown) isInvShown=true;
            else    isInvShown=false;
            break;
    }
}

// Displays UI Inventory
ShowInventory = function(){
    // X and Y coordinates of the menu
    var x = hero.s.x + 50;
    var y = hero.s.y - 300
    var invWidth = 325;
    var invHeight = 500;
    // Graphics Object to do some drawing with
    var g = new createjs.Graphics();
    g.beginFill("#FFFFFF");
    g.rr(0,0, invWidth, invHeight, .5);
    var roundedMenu = new createjs.Shape(g);
    roundedMenu.x =  hero.s.x + 50;
    roundedMenu.y =  hero.s.y - 400;

    // Add that menu to the stagee
    stage.addChild(roundedMenu);
}

CenterScreen = function () {
    //move screen to center on hero
    if (-stage.x < hero.s.x - 400) {
        stage.x -= hero.speed;
    }
    if (-stage.y < hero.s.y - 400) {
        stage.y -= hero.speed;
    }
    if (-stage.x > hero.s.x - 400) {
        stage.x += hero.speed;
    }
    if (-stage.y > hero.s.y - 400) {
        stage.y += hero.speed;
    }
}

Array.prototype.contains = function(elem)
{
   for (var i in this)
   {
       if (this[i] == elem) return true;
   }
   return false;
}