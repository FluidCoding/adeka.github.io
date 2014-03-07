/**
 * Created by gramp_000 on 3/5/14.
 */
/**
 * Created by gramp_000 on 3/5/14.
 */
function Hero() {
    Unit.call(this);
    this.speed = 5;
    this.originalSpeed = 5;
    this.anims = new createjs.SpriteSheet({
        "animations": {
            "down": [0, 2, "down", this.framerate],
            "up": [3, 5, "up", this.framerate],
            "right": [6, 8, "right", this.framerate],
            "left": [9, 11, "left", this.framerate]},

        "images": ["assets/spritesheet.png"],

        "frames": {
            "height": 48,
            "width": 36,
            "regX": 0,
            "regY": 0,
            "count": 12

        }
    });
    this.s = new createjs.Sprite(this.anims, this.dir);
}

Hero.prototype = new Unit();
Hero.prototype.constructor = Hero;
