/**
 * Created by gramp_000 on 3/6/14.
 */
function Chunk(stage, simplex, simplex2, xOrigin, yOrigin) {
    this.stage = stage;

    this.nextChunk;

    this.xOrigin = xOrigin;
    this.yOrigin = yOrigin;
    this.chunkSize = 20;
    this.width = this.chunkSize*50;
    var tileCount = this.chunkSize * this.chunkSize;
    var xPos = xOrigin, yPos = yOrigin;

    this.tiles = [];
    this.units = [];

    for (var i = 0; i < tileCount; i++) {
        var bunnyChance = Math.random() * 1000;
        var wolfChance = Math.random() * 1000;
        var deerChance = Math.random() * 1000;
        var fishChance = Math.random() * 1000;
        if (i % this.chunkSize == 0) {
            xPos = this.xOrigin;
            yPos += 1;
        }
        else {
            xPos += 1;
        }
        var type;
        var blurNoise = simplex.noise2D(xPos / 20, yPos / 20) * 10;
        var landNoise = simplex.noise2D(xPos / 8, yPos / 8) * 15;
        var noise = simplex.noise2D(xPos, yPos) * 10;
        var decalNoise = simplex2.noise2D(xPos, yPos) * 10;
        var yOffset = 0;
        if (blurNoise > 4) {
            type = 3;
            yOffset = 13;
        }
        else if (landNoise > 8) {
            type = 4;
            //yOffset = 8 - landNoise;
        }
        else if (blurNoise > 3) {
            type = 2;
        }
        else {
            type = 0;
            yOffset = landNoise;
        }

        var tile = new Tile(type);

        tile.s.x = xPos * 50 + 0 + tile.xOffset;
        tile.s.y = yPos * 50 + 0 + yOffset;
        if (type != 3) {
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
            if (noise > 4) {
                var decal = new Decal(1);
                tile.AddDecal(decal);
            }
            else if (noise > 3) {
                var decal = new Decal(3);
                tile.AddDecal(decal);
            }

            if (!tile.decal) {
                if (bunnyChance > 988) {
                    var bunny = new NPC("bunny");
                    bunny.s.x = tile.s.x;
                    bunny.s.y = tile.s.y;
                    //units.push(bunny);
                }
                else if (deerChance > 988) {
                    var deer = new NPC("deer");
                    deer.s.x = tile.s.x;
                    deer.s.y = tile.s.y;
                    //units.push(deer);
                }
                else if (wolfChance > 988) {
                    var deer = new NPC("wolf");
                    deer.s.x = tile.s.x;
                    deer.s.y = tile.s.y;
                    //units.push(deer);
                }
            }


        }
        else if(type == 3){
            if(fishChance > 980){
              var fish = new NPC("fish");
                fish.s.x = tile.s.x;
                fish.s.y = tile.s.y;
                //units.push(fish);
            }
        }
        // stage.update();

        this.tiles.push(tile);
    }
}

Chunk.prototype.Update = function () {

    this.SetUnitTiles();
    this.CheckUnitDecalCollision();
    this.CheckUnitTileCollision();
    this.UpdateUnits();
    this.Draw();

    //stage.update();
}
Chunk.prototype.UpdateUnits = function () {
    for (var i = 0; i < this.units.length; i++) {
        this.units[i].Update();
        if (this.units[i] instanceof NPC) {
            this.units[i].Wander();
        }
    }
}
Chunk.prototype.Draw = function () {
    //draw everything in the right order
    for (var i = 0; i < this.tiles.length; i++) {
        var tilex = this.tiles[i].s.x + stage.x;
        var tiley = this.tiles[i].s.y + stage.y;
        var distance = Math.sqrt(Math.pow(tilex - 400, 2) + Math.pow(tiley - 450, 2));
        if (distance < 450) {
            stage.addChild(this.tiles[i].s);
            this.tiles[i].Update();
            this.DrawUnits(this.tiles[i]);
            if (this.tiles[i].decal != null) {
                stage.addChild(this.tiles[i].decal.s);
                //this.tiles[i].decal.Update();
            }
        }
    }
}
Chunk.prototype.DrawUnits = function (tile) {
    for (var i = 0; i < this.units.length; i++) {
        this.units[i].Draw(tile, stage);
    }
}
Chunk.prototype.SetUnitTiles = function () {
    //detect the tile directly underneath the hero
    for (var i = 0; i < this.tiles.length; i++) {
        for (var j = 0; j < this.units.length; j++) {
            var nextTile;
            if(i + 1 % this.chunkSize == 0){
                //nextTile = this.tiles[i - 1];

               // nextTile = this.nextChunk.tiles[i - this.chunkSize + 1];
            }
            else{
                nextTile = this.tiles[i + 1];
            }
            this.units[j].CheckTilePair(this.tiles[i], nextTile);
        }
    }
}
Chunk.prototype.CheckUnitDecalCollision = function () {
    //decal collisions
    for (var i = 0; i < this.tiles.length; i++) {
        if (this.tiles[i].decal) {
            for (var j = 0; j < this.units.length; j++) {
                this.units[j].CheckDecalCollision(this.tiles[i]);
            }
        }
    }
}
Chunk.prototype.CheckUnitTileCollision = function () {
    //tile collision
    for (var i = 0; i < this.tiles.length; i++) {
        for (var j = 0; j < this.units.length; j++) {
            this.units[j].CheckTileCollision(this.tiles[i]);
        }
    }
}
Chunk.prototype.ContainsUnit = function(unit){
    var b =
    (unit.s.x + 18 >= this.xOrigin*50) &&
    (unit.s.x + 18 <= this.xOrigin*50 + this.width) &&
    (unit.s.y <= this.yOrigin*50 + this.width) &&
    (unit.s.y >= this.yOrigin*50 );
    return b;
}
