/**
 * Created by gramp_000 on 3/5/14.
 */
/**
 * Created by gramp_000 on 3/5/14.
 */
function Hero() {
    Unit.call(this);
    this.anims = new createjs.SpriteSheet({
        "animations": {
            "down": [0, 2, "down", .1],
            "up": [3, 5, "up", .1],
            "right": [6, 8, "right", .1],
            "left": [9, 11, "left", .1]},

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
