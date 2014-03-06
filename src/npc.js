/**
 * Created by gramp_000 on 3/5/14.
 */
function NPC(type){
    Unit.call(this);
    this.wanderTimerCap = 100 + Math.random() * 100;
    this.wanderTimer = 250;
    this.wanderX = 0;
    this.wanderY = 0;
    switch(type){
        case "bunny" :
            //this.originalSpeed = 5;
            this.speed = .35;
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
            break;
        case "deer" :
         this.speed = .7;
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
            break;
        case "wolf" :
            this.speed = .9;
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
            break;
    }
    this.s = new createjs.Sprite(this.anims, this.dir);
}

NPC.prototype = new Unit();
NPC.prototype.constructor = NPC;

        NPC.prototype.Wander = function(){
                var sleepChance;
                if(this.wanderTimer <= this.wanderTimerCap){
                    this.wanderTimer++;
                }
                if(this.colH || this.colV){
                    this.wanderTimer += 25;
                }
                if(this.wanderTimer >= 100){
                    console.log("reset");
                    this.wanderTimer = 0;
                    this.wanderTimerCap = 100 + Math.random() * 100;
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