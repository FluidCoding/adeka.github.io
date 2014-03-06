function Unit() {
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
        this.rootStage;
        this.nextTile;
        this.colH = false;
        this.colV = false;
        this.wanderTimer = 110;
        this.wanderX = 0;
        this.wanderY = 0;
        //32x24
        //this.s = new createjs.Bitmap("assets/hero.png");

    this.anims = new createjs.SpriteSheet({
				"animations":
				{
					"down": [0, 2, "down", .1],
					"left": [3, 5, "left",.1],
                    "right": [6, 8, "right",.1],
                    "up": [9, 11, "up",.1]},

					"images": ["assets/bunny.png"],

					"frames":
						{
							"height": 31,
							"width": 31,
							"regX": 0,
							"regY": -12,
							"count": 12

						}
		});
        /*
    this.anims = new createjs.SpriteSheet({
				"animations":
				{
					"down": [0, 2, "down", .1],
					"left": [3, 5, "left",.1],
                    "right": [6, 8, "right",.1],
                    "up": [9, 11, "up",.1]},

					"images": ["assets/deer.png"],

					"frames":
						{
							"height": 32,
							"width": 32,
							"regX": -4,
							"regY": -9,
							"count": 12

						}
		});


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
							"height": 35,
							"width":36,
							"regX": 0,
							"regY": -7,
							"count": 12

						}
		});
		*/
    /*
        this.anims = new createjs.SpriteSheet({
				"animations":
				{
					"down": [0, 2, "down", .1],
					"up": [3, 5, "up",.1],
                    "right": [6, 8, "right",.1],
                    "left": [9, 11, "left",.1]},

					"images": ["assets/spritesheet.png"],

					"frames":
						{
							"height": 48,
							"width":36,
							"regX": 0,
							"regY": 0,
							"count": 12

						}
		});
*/
        this.newY = 0;
        this.s = new createjs.Sprite(this.anims, this.dir);
        this.shadow = new createjs.Bitmap("assets/shadow.png");
}
        Unit.prototype.Update = function(){
            this.CheckDrowning();
            if(!this.drowning){
               // this.Wander();
                this.Animate();
                this.CalculateJump();
                this.CalculatePosition();
            }
        }
        Unit.prototype.Jump = function(){
            this.jumping = true;
        }
        Unit.prototype.CheckDrowning = function(){
            if(this.currentType == 3 && !this.jumping && !this.falling){
                this.drowning = true;
            }
            if(!this.drowning && !this.jumping && !this.falling){
                this.lastTile = this.currentTile;
            }
            if(this.curOpacity <= .1){
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
            if(this.drowning){
                this.curOpacity -= .05;
                this.s.y +=1;
                this.s.set({alpha: this.curOpacity});
                this.shadow.set({alpha: 0});
                this.speed = 0;
                this.xVel = 0;
                this.yVel = 0;
            }
        }
        Unit.prototype.Face = function(dir){
            // Fixes the animation freeze on from previous stop()
            if(dir == "stop"){
                if (this.dir!="stop") {
                    this.s.gotoAndPlay(this.dir);
                }
            }
            else{
                this.dir = dir;
                var x = this.s.x, y = this.s.y;
                this.s = new createjs.Sprite(this.anims, dir);
                this.s.x = x;
                this.s.y = y;
            }
        }
        Unit.prototype.CalculatePosition = function(){
            this.s.set({regY : this.newY + this.incY});
            this.shadow.set({regY : this.yOffset});
            this.shadow.x = this.s.x - 5;
            this.shadow.y = this.s.y;
            //actually moving the hero
            if(!this.falling)
            {
                if(!this.colH){
                    this.s.x += this.xVel;
                }
                if(!this.colV){
                    this.s.y += this.yVel;
                }
            }
            else{
                this.s.x += this.xVel;
                this.s.y += this.yVel;
            }
            this.colH = false;
            this.colV = false;
        }
        Unit.prototype.CalculateJump = function(){
                if(this.incY < this.yOffset){
                    this.incY+=3;
                    this.falling = true;
                }
                if(this.incY > this.yOffset){
                    this.incY-=3;
                }
                if(this.incY == this.yOffset){
                    this.falling = false;
                }

                if(this.jumpCounter >= 15){
                    this.falling = true;
                }
                if(this.jumpCounter >= 31){
                        this.jumping = false;
                        this.jumpCounter = 0;
                        this.falling = false;
                }
                if(this.jumping){

                        this.jumpCounter++;
                       // this.s.y++;
                        this.newY = Math.sin(this.jumpCounter/10)*35;
                       // this.s.set({regY : this.newY});

                }
        }
        Unit.prototype.Animate = function(){
            if(Math.abs(this.yVel) > Math.abs(this.xVel)){
                if(this.yVel > 0){
                    if(this.dir != "down"){
                        this.Face("down");
                    }
                }
                else if(this.yVel < 0){
                    if(this.dir != "up"){
                        this.Face("up");
                    }
                }
            }
            if(Math.abs(this.xVel) > Math.abs(this.yVel)){
                if(this.xVel > 0){
                    if(this.dir != "right"){
                        this.Face("right");
                    }
                    this.sideDir = "right";
                }
                else if(this.xVel < 0){
                    if(this.dir != "left"){
                        this.Face("left");

                    }
                    this.sideDir = "left";
                }
            }
                            //stop
            if(this.xVel == 0 && this.yVel == 0){
                    this.Face("stop");
            }
        }
        Unit.prototype.Wander = function(){
                var sleepChance;
                if(this.wanderTimer <= 100){
                    this.wanderTimer++;
                }
                if(this.colH || this.colV){
                    this.wanderTimer += 25;
                }
                if(this.wanderTimer >= 100){
                    console.log("reset");
                    this.wanderTimer = 0;
                    sleepChance = Math.random();
                    if(sleepChance > .75){
                        this.wanderX = this.s.x;
                        this.wanderY = this.s.y;
                    }
                    else{
                        this.wanderX = this.s.x + ( 1.0 - Math.random()*2.0)*300;
                        this.wanderY = this.s.y + ( 1.0 - Math.random()*2.0)*300;
                    }
                }


                if(sleepChance > .75){
                    this.xVel = 0;
                    this.yVel = 0;
                }
                else{
                    var wanderVecX = this.wanderX - this.s.x;
                    var wanderVecY = this.wanderY - this.s.y;
                    this.xVel = wanderVecX/300/this.speed;
                    this.yVel = wanderVecY/300/this.speed;
                }
        }

	/**
 * Created by gramp_000 on 3/2/14.
 */
