function Hero() {
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

        this.originalSpeed = 1.6;
        this.speed = this.originalSpeed;
        this.rootStage;
        this.nextTile;
        this.colH = false;
        this.colV = false;
        //32x24
        //this.s = new createjs.Bitmap("assets/hero.png");

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

        this.newY = 0;

        this.s = new createjs.Sprite(this.anims, this.dir);
        this.shadow = new createjs.Bitmap("assets/shadow.png");
        this.Jump = function Jump(){
            this.jumping = true;
           // console.log(this.s.regX);
        }
        this.Update = function Update(){
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
            else{
                if(this.yVel > 0){
                    if(hero.dir != "down"){
                        hero.Face("down");
                    }
                }
                else if(this.yVel < 0){
                    if(hero.dir != "up"){
                        hero.Face("up");
                    }
                }
                else if(this.xVel > 0){
                    if(hero.dir != "right"){
                        hero.Face("right");
                    }
                }
                else if(this.xVel < 0){
                    if(hero.dir != "left"){
                        hero.Face("left");
                    }
                }
                else{
                    hero.Face("stop");
                }
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
                this.s.set({regY : Math.sin(this.jumpCounter/10)*35});
                //this.anims.gotoAndPlay(this.dir);
                this.shadow.x = this.s.x - 5;
                this.shadow.y = this.s.y;
                //if(this.s)
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
            this.s.set({regY : this.newY + this.incY});
            this.shadow.set({regY : this.yOffset});

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

        this.Drown = function Drown(){
           // this.s.set({alpha: this.s.alpha -.1});
        }
        this.Face = function Face(dir){
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

	}/**
 * Created by gramp_000 on 3/2/14.
 */
