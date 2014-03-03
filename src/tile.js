/**
 * Created by gramp_000 on 3/2/14.
 */
   function Tile(type) {
        this.xOffset = 0;
        this.yOffset = 0;
        this.type = type;
        var s;
         this.rando = Math.random() * 2;
        switch (type)
        {
            case 0:
                s = new createjs.Bitmap("assets/grass.png");

                break;
            case 1:
                s = new createjs.Bitmap("assets/rock.png");

                break;
            case 2:
                s = new createjs.Bitmap("assets/dirt.png");
                break;
            case 3:
                s = new createjs.Bitmap("assets/water.png");
                s.set({alpha :.3, regX : 0});
                //this.xOffset = 25;
                break;
            case 4:
                s = new createjs.Bitmap("assets/tall.png");
                s.set({regY : 25});
                    this.yOffset = 25;
                //this.xOffset = 25;
                break;
        }
        this.s = s;
        this.AddDecal = AddDecal;
        function AddDecal(decal){
            this.decal = decal;
            decal.s.x = s.x + decal.xOffset;
            decal.s.y = s.y + decal.yOffset - this.yOffset;

        }
        this.UseDecal = function UseDecal(){
            this.decal.Use();
            this.decal = null;
        }
        this.Update = function Update(){

            if(this.type == 3){
               // s.set({scaleX : 1 + Math.sin((counter)/50 + this.rando)/10})*2;
               //  s.set({scaleY : 1 + Math.sin((counter)/50 + this.rando)/1000});
                s.set({alpha :.3 + Math.sin((counter)/50 + this.rando)/20});
               // s.set({skewX : -1 + Math.sin((counter)/25) * 4});
                //s.set({skewY : -1 + Math.sin((counter)/25) * 4});
            }
        }

	}