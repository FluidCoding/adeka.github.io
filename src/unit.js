function Unit() {
    this.framerate = .075;
    this.yVel = 0;
    this.xVel = 0;
    this.isDrawn = false;
    this.jumping = false;
    this.falling = false;
    this.jumpCounter = 0;
    this.dir = "right";
    this.currentType = 0;
    this.currentTile;
    this.lastTile;
    this.yOffset = 0;
    this.incY = 0;
    this.curOpacity = 1.0;
    this.drowning = false;
    this.sideDir = "right";
    this.originalSpeed = 1.6;
    this.speed = this.originalSpeed;
    this.nextTile;
    this.colH = false;
    this.colV = false;
    this.aquatic = false;
    this.newY = 0;
    this.shadow = new createjs.Bitmap("assets/shadow.png");
}
Unit.prototype.Update = function () {
    this.isDrawn = false;
    if(!this.aquatic){
        this.CheckDrowning();
    }
    if (!this.drowning) {
        this.Animate();
        this.CalculateJump();
        this.CalculatePosition();
    }
}
Unit.prototype.Jump = function () {
    this.jumping = true;
}
Unit.prototype.CheckDrowning = function () {
    if (this.currentType == 3 && !this.jumping && !this.falling) {
        this.drowning = true;
    }
    if (!this.drowning && !this.jumping && !this.falling) {
        this.lastTile = this.currentTile;
    }
    if (this.curOpacity <= .1) {
        // this.rootStage.x += Math.abs(this.s.x - this.lastTile.s.x);
        // this.rootStage.y -= Math.abs(this.s.y - this.lastTile.s.y);
        this.drowning = false;
        this.jumping = false;
        this.falling = false;
        this.s.y = this.lastTile.s.y;
        this.s.x = this.lastTile.s.x;
        this.currentType = this.lastTile.type;
        this.s.set({alpha: 1});
        this.curOpacity = 1.0;
        this.shadow.set({alpha: 1});
        this.speed = this.originalSpeed;
    }
    if (this.drowning) {
        this.curOpacity -= .05;
        this.s.y += 1;
        this.s.set({alpha: this.curOpacity});
        this.shadow.set({alpha: 0});
        this.speed = 0;
        this.xVel = 0;
        this.yVel = 0;
    }
}
Unit.prototype.Face = function (dir) {
    // Fixes the animation freeze on from previous stop()
    if (dir == "stop") {
        if (this.dir != "stop") {
            this.s.gotoAndPlay(this.dir);
        }
    }
    else {
        this.dir = dir;
        var x = this.s.x, y = this.s.y;
        this.s = new createjs.Sprite(this.anims, dir);
        this.s.x = x;
        this.s.y = y;
    }
}
Unit.prototype.CalculatePosition = function () {
    this.s.set({regY: this.newY + this.incY});
    this.shadow.set({regY: this.yOffset});
    this.shadow.x = this.s.x - 5;
    this.shadow.y = this.s.y;
    //actually moving the hero
    if (!this.falling) {
        if (!this.colH) {
            this.s.x += this.xVel;
        }
        if (!this.colV) {
            this.s.y += this.yVel;
        }
    }
    else {
        this.s.x += this.xVel;
        this.s.y += this.yVel;
    }
    this.colH = false;
    this.colV = false;
}
Unit.prototype.CalculateJump = function () {
    if (this.incY < this.yOffset) {
        this.incY += 3;
        this.falling = true;
    }
    if (this.incY > this.yOffset) {
        this.incY -= 3;
    }
    if (this.incY == this.yOffset) {
        this.falling = false;
    }

    if (this.jumpCounter >= 15) {
        this.falling = true;
    }
    if (this.jumpCounter >= 31) {
        this.jumping = false;
        this.jumpCounter = 0;
        this.falling = false;
    }
    if (this.jumping) {

        this.jumpCounter++;
        // this.s.y++;
        this.newY = Math.sin(this.jumpCounter / 10) * 35;
        // this.s.set({regY : this.newY});

    }
}
Unit.prototype.Animate = function () {
    if (Math.abs(this.yVel) > Math.abs(this.xVel)) {
        if (this.yVel > 0) {
            if (this.dir != "down") {
                this.Face("down");
            }
        }
        else if (this.yVel < 0) {
            if (this.dir != "up") {
                this.Face("up");
            }
        }
    }
    if (Math.abs(this.xVel) > Math.abs(this.yVel)) {
        if (this.xVel > 0) {
            if (this.dir != "right") {
                this.Face("right");
            }
            this.sideDir = "right";
        }
        else if (this.xVel < 0) {
            if (this.dir != "left") {
                this.Face("left");

            }
            this.sideDir = "left";
        }
    }
    //stop
    if (this.xVel == 0 && this.yVel == 0) {
        this.Face("stop");
    }
}
Unit.prototype.CheckTilePair = function (tile, nextTile) {
    if (
        ((this.s.x + 18 < tile.s.x + 50) &&
            (this.s.x + 18 + 0 > tile.s.x - 0)) &&
            ((this.s.y + 45 < tile.s.y + 70 + tile.colYOffset) &&
                (this.s.y + 45 > tile.s.y + 0))
        ) {
        this.currentType = tile.type;
        this.currentTile = tile;
        this.nextTile = nextTile;
        this.yOffset = tile.yOffset;
    }
}
Unit.prototype.CheckTileCollision = function (tile) {
    var aquaticOffset = 0;
    if(this.aquatic) aquaticOffset = 60;
    if ((tile.type == 0 && this.aquatic) ||
        (tile.type == 2 && this.aquatic) ||
        (tile.type == 4 && this.aquatic) ||
        (!this.aquatic &&
        (tile.type == 3 && !this.jumping && !this.drowning) ||
        (tile.type == 4 && this.currentType != 4 && !this.jumping || this.falling) ||
        (tile.decal && this.jumping))) {
        if (((this.s.x + 18 + this.xVel < tile.s.x + 50 + aquaticOffset/2) &&
            (this.s.x + 18 + this.xVel > tile.s.x - 0 - aquaticOffset/2)) &&
            ((this.s.y < tile.s.y + tile.colYOffset + aquaticOffset ) &&
                (this.s.y > tile.s.y - 50 ))) {
            this.colH = true;
        }
        if (((this.s.x + 18 < tile.s.x + 50 + aquaticOffset/2) &&
            (this.s.x + 18 > tile.s.x - 0 - aquaticOffset/2)) &&
            ((this.s.y + this.yVel < tile.s.y + tile.colYOffset + aquaticOffset ) &&
                (this.s.y + this.yVel > tile.s.y - 50 ))) {
            this.colV = true;
        }
    }
}
Unit.prototype.CheckDecalCollision = function (tile) {
    var dx = tile.decal.s.x - tile.decal.xOffset;
    var dy = tile.decal.s.y - tile.decal.yOffset - 25 + tile.yOffset;
    var hx = this.s.x;
    var hy = this.s.y;
    var vhx = this.s.x + this.xVel;
    var vhy = this.s.y + this.yVel;
    var distance = Math.sqrt(Math.pow(dx - hx, 2) + Math.pow(dy - hy, 2));
    var xdistance = Math.sqrt(Math.pow(dx - vhx, 2) + Math.pow(dy - hy, 2));
    var ydistance = Math.sqrt(Math.pow(dx - hx, 2) + Math.pow(dy - vhy, 2));
    if (xdistance < 25) {
        this.colH = true;
    }
    if (ydistance < 25) {
        this.colV = true;
    }
    if (distance <= 25) {
        //caught
        this.s.y += 2;
    }
}
Unit.prototype.Draw = function (tile, stage) {
    if (tile == this.nextTile) {
        if (!this.isDrawn) {
            if(!this.aquatic) stage.addChild(this.shadow);
            stage.addChild(this.s);
            this.isDrawn = true;
        }
    }
}
Unit.prototype.GetColH = function(){
    return this.colH;
}
/**
 * Created by gramp_000 on 3/2/14.
 */
