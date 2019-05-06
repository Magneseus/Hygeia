(function() {
    "use strict";
    
    class Engine {
        constructor(canvas, ctx) {
            console.log('hello world!');
            
            this.scale = 6;
            
            this._canvas = canvas;
            this._context = ctx;
            
            this.width = canvas.width/this.scale;
            this.height = canvas.height/this.scale;
            
            this.reset();
            
            this.currentSandType = 0;
            this.newSandSpawn = [];
        }
        
        simTick() {
            //if (this.gridList[spawnVec.x][spawnVec.y] !== null) {
            //    this.reset();
            //}
            
            let simChanged = false;
            
            this.sandList.forEach((sand) => {
                if (sand.simTick()) {
                    simChanged = true;
                }
            });
            
            // Spawn new entities
            while (this.newSandSpawn.length > 0) {
                let sandSpawn = this.newSandSpawn.shift();
                if (Sand.createSand(this, sandSpawn.pos, sandSpawn.type)) {
                    simChanged = true;
                }
            }
            
            return simChanged;
        }
        
        renderTick(cnv, ctx) {
            ctx.putImageData(this.gridImgData, 0, 0);
        }
        
        onKeyboardDown(event) {
            if (!event.repeat) {
                let parsed = parseInt(event.key, 10);
                if (isNaN(parsed)) {
                    parsed = 0;
                }
                
                this.currentSandType = parsed;
            }
        }
        
        queueCreateSand(pos, type) {
            let sType = null;
            if (Number.isInteger(type)) {
                sType = Sand.types[type];
            } else {
                sType = type;
            }
            
            this.newSandSpawn.push({pos: pos, type: sType });
        }
        
        onMouseDown(mousePos) {
            let spawnVec = new iVec2D(mousePos.x, mousePos.y);
            spawnVec.scalarDiv(this.scale);
            this.queueCreateSand(spawnVec, this.currentSandType);
        }
        
        reset(map=null) {
            if (map === null) {
                this.gridList = [];
                for (var i = 0; i < this.width; i++) {
                    this.gridList.push([]);
                    for (var j = 0; j < this.height; j++) {
                        this.gridList[i].push(null);
                    }
                }
                
                this._context.fillStyle = 'rgb(172, 177, 196)';
                this._context.fillRect(0,0,this.width*this.scale,this.height*this.scale);
                
                this.gridImgData = this._context.getImageData(0,0,this.width*this.scale,this.height*this.scale);
                
                this.sandList = [];
            } else {
                this.gridList = [];
                this.sandList = [];
                
                this._context.fillStyle = 'rgb(172, 177, 196)';
                this._context.fillRect(0,0,this.width*this.scale,this.height*this.scale);
                this.gridImgData = this._context.getImageData(0,0,this.width*this.scale,this.height*this.scale);
                
                map.loadInto(this);
            }
        }
    }
    window.Engine = Engine;
    
})();
