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
            this.newSandSpawn = null;
        }
        
        simTick() {
            let spawnVec = new iVec2D(Math.floor(this.width/2), 0);
            
            if (this.gridList[spawnVec.x][spawnVec.y] === null) {
                //this.reset();
                this.createSand(spawnVec, 'sand');
            }
            
            if (this.newSandSpawn !== null) {
                this.createSand(this.newSandSpawn.pos, this.newSandSpawn.type);
                this.newSandSpawn = null;
            }
            
            this.sandList.forEach((e) => {
                e.simTick();
            });
        }
        
        renderTick(cnv, ctx) {
            ctx.putImageData(this.gridImgData, 0, 0);
        }
        
        createSand(pos, type) {
            if (this.gridList[pos.x][pos.y] !== null) {
                return;
            }
            
            let s = new Sand(
                pos,
                type,
                this.gridList,
                this.gridImgData,
                this.scale
            );
            
            this.gridList[pos.x][pos.y] = s;
            this.sandList.push(s);
            s.renderTick();
        }
        
        onKeyboardDown(event) {
            if (!event.repeat) {
                if (event.key === '1') {
                    this.currentSandType = 1;
                } else if (event.key === '2') {
                    this.currentSandType = 2;
                } else if (event.key === '3') {
                    this.currentSandType = 3;
                } else if (event.key === '0') {
                    this.currentSandType = 0;
                }
            }
        }
        
        onMouseDown(mousePos) {
            let spawnVec = new iVec2D(mousePos.x, mousePos.y);
            spawnVec.scalarDiv(this.scale);
            this.newSandSpawn = {pos: spawnVec, type: Sand.types[this.currentSandType] };
        }
        
        reset() {
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
        }
    }
    window.Engine = Engine;
    
    class randGen {
        static setSeed(seed) {
            randGen.seed = seed;
        }
        
        static rand32() {
            let x = randGen.seed;
            x = x ^ (x << 13);
            x = x ^ (x >> 17);
            x = x ^ (x << 5);
            randGen.seed = x;
            return x;
        }
        
        static u_rand32() {
            let x = randGen.rand32();
            return (~x + 1);
        }
        
        static coinFlip() {
            let x = randGen.rand32();
            let y = ((1<<31) & x) >> 31;
            y = ~y + 1;
            
            return y === 1;
        }
    }
    randGen.seed = 12;
    window.randGen = randGen;
    
    class iVec2D {
        constructor(x,y) {
            if (!Number.isInteger(x) || !Number.isInteger(y)) throw new Error('Invalid number type for iVec2D!');
            this.x = x;
            this.y = y;
        }
        
        equals(i_vec2D) {
            if (!(i_vec2D instanceof iVec2D)) throw new Error('Invalid type for iVec2D operation.');
            return this.x === i_vec2D.x && this.y === i_vec2D.y;
        }
        
        add(i_vec2D) {
            if (!(i_vec2D instanceof iVec2D)) throw new Error('Invalid type for iVec2D operation.');
            this.x += i_vec2D.x;
            this.y += i_vec2D.y;
        }
        
        sub(i_vec2D) {
            if (!(i_vec2D instanceof iVec2D)) throw new Error('Invalid type for iVec2D operation.');
            this.x -= i_vec2D.x;
            this.y -= i_vec2D.y;
        }
        
        dot(i_vec2D) {
            if (!(i_vec2D instanceof iVec2D)) throw new Error('Invalid type for iVec2D operation.');
            return (this.x * i_vec2D.x) + (this.y * i_vec2D.y);
        }
        
        scalarMul(scalar) {
            if (!Number.isInteger(scalar)) throw new Error('Invalid number type for iVec2D!');
            this.x *= scalar;
            this.y *= scalar;
        }
        
        scalarDiv(scalar) {
            if (!Number.isInteger(scalar)) throw new Error('Invalid number type for iVec2D!');
            this.x = Math.floor(this.x / scalar);
            this.y = Math.floor(this.y / scalar);
        }
    }
    window.iVec2D = iVec2D;
    
    class Sand {
        constructor(pos, type, gridList, gridImgData, size=1) {
            if (!Sand.types.includes(type)) throw new Error('Invalid Sand type!');
            if (!(pos instanceof iVec2D)) throw new Error('Sand requires an iVec2D for position.');
            if (!(gridList instanceof Array)) throw new Error('Sand requires an array for gridList.');
            
            this.pos = pos;
            this.type = type;
            this.gridList = gridList;
            this.gridImgData_ptr = gridImgData;
            this.gridImgData = gridImgData.data;
            this.pixelSize = size;
        }
        
        checkBelow() {
            if (this.type === 'stone') {
                return this.pos;
            }
            
            let p = this.pos;
            let g = this.gridList;
            
            if (p.y >= g[0].length-1) return this.pos;
            
            if (g[p.x][p.y+1] === null) {
                return new iVec2D(p.x, p.y+1);
            } else if (this.type === 'sand' && g[p.x][p.y+1].type === 'water') {
                this.swapSand(g[p.x][p.y+1]);
                return this.pos;
            }
            
            if (p.x <= 0 || p.x >= g.length-1) return this.pos;2
            
            let goLeftFirst = randGen.coinFlip();
            let xDelta = 1;
            
            if (goLeftFirst) {
                xDelta = -1;
            }
            
            if (g[p.x + xDelta][p.y+1] === null) {
                return new iVec2D(p.x + xDelta, p.y+1);
            } else if (g[p.x - xDelta][p.y+1] === null) {
                return new iVec2D(p.x - xDelta, p.y+1);
            }
            
            if (this.type === 'water') {
                if (g[p.x + xDelta][p.y] === null) {
                    return new iVec2D(p.x + xDelta, p.y);
                } else if (g[p.x - xDelta][p.y] === null) {
                    return new iVec2D(p.x - xDelta, p.y);
                }
            }
            
            return this.pos;
        }
        
        simTick() {
            let newPos = this.checkBelow();
            if (newPos !== this.pos) {
                this.gridList[newPos.x][newPos.y] = this;
                this.gridList[this.pos.x][this.pos.y] = null;
                
                this.setPixel(newPos.x, newPos.y, Sand.colors[this.type]);
                this.setPixel(this.pos.x, this.pos.y, Sand.colors['none']);
                
                this.pos = newPos;
            }
        }
        
        swapSand(swSand) {
            this.gridList[swSand.pos.x][swSand.pos.y] = this;
            this.gridList[this.pos.x][this.pos.y] = swSand;
            
            this.setPixel(swSand.pos.x, swSand.pos.y, Sand.colors[this.type]);
            this.setPixel(this.pos.x, this.pos.y, Sand.colors[swSand.type]);
            
            let oldPos = this.pos;
            this.pos = swSand.pos;
            swSand.pos = oldPos;
        }
        
        renderTick() {
            this.setPixel(this.pos.x, this.pos.y, Sand.colors[this.type]);
        }
        
        setPixel(x, y, col, size=this.pixelSize) {
            let newX = x * size;
            let newY = y * size;
            
            for (var yDelta = 0; yDelta < size; yDelta++) {
                for (var xDelta = 0; xDelta < size; xDelta++) {
                    let newPos = ((newX + xDelta) + ((newY + yDelta) * (this.gridImgData_ptr.width))) * 4;
                    this.gridImgData[newPos] = col[0];
                    this.gridImgData[newPos+1] = col[1];
                    this.gridImgData[newPos+2] = col[2];
                }
            }
        }
    }
    Sand.types  = ['none', 'sand', 'water', 'stone'];
    Sand.colors = {
        'none': [172, 177, 196],
        'sand': [231, 234, 18],
        'water': [28, 104, 219],
        'stone': [58, 59, 63]
    };
    window.Sand = Sand;
    
})();
