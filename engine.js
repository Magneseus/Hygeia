(function() {
    "use strict";
    
    class Engine {
        constructor(canvas, ctx) {
            console.log('hello world!');
            
            this.width = canvas.width;
            this.height = canvas.height;
            
            console.log(this.width);
            console.log(this.height);
            
            this.gridList = [];
            for (var i = 0; i < this.width; i++) {
                this.gridList.push([]);
                for (var j = 0; j < this.height; j++) {
                    this.gridList[i].push(null);
                }
            }
            
            this.gridImgData = ctx.getImageData(0,0,this.width,this.height);
        }
        
        simTick() {
            this.gridList[Math.floor(this.width/2)][10] = new Sand(
                new iVec2D(Math.floor(this.width/2), 10),
                'sand',
                this.gridList,
                this.gridImgData
            );
            
            for (var i = 0; i < this.width; i++) {
                for (var j = 0; j < this.height; j++) {
                    if (this.gridList[i][j])
                        this.gridList[i][j].simTick();
                }
            }
        }
        
        renderTick(cnv, ctx) {
            ctx.putImageData(this.gridImgData, 0, 0);
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
            this.x /= scalar;
            this.y /= scalar;
        }
    }
    window.iVec2D = iVec2D;
    
    class Sand {
        constructor(pos, type, gridList, gridImgData) {
            if (!Sand.types.includes(type)) throw new Error('Invalid Sand type!');
            if (!(pos instanceof iVec2D)) throw new Error('Sand requires an iVec2D for position.');
            if (!(gridList instanceof Array)) throw new Error('Sand requires an array for gridList.');
            
            this.pos = pos;
            this.type = type;
            this.gridList = gridList;
            this.gridImgData_ptr = gridImgData;
            this.gridImgData = gridImgData.data;
        }
        
        checkBelow() {
            let p = this.pos;
            let g = this.gridList;
            
            if (p.y >= g[0].length) return this.pos;
            
            if (g[p.x][p.y+1] === null) {
                return new iVec2D(p.x, p.y+1);
            }
            
            if (p.x <= 0 || p.x >= g.length) return this.pos;
            
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
            
            return this.pos;
        }
        
        simTick() {
            let newPos = this.checkBelow();
            if (newPos !== this.pos) {
                this.gridList[newPos.x][newPos.y] = this;
                this.gridList[this.pos.x][this.pos.y] = null;
                
                let newColorPos = (newPos.x * this.gridList.length) + newPos.y;
                let oldColorPos = (this.pos.x * this.gridList.length) + this.pos.y;
                
                this.gridImgData[newColorPos] = Sand.colors[this.type][0];
                this.gridImgData[newColorPos+1] = Sand.colors[this.type][1];
                this.gridImgData[newColorPos+2] = Sand.colors[this.type][2];
                
                this.gridImgData[oldColorPos] = Sand.colors['none'][0];
                this.gridImgData[oldColorPos+1] = Sand.colors['none'][1];
                this.gridImgData[oldColorPos+2] = Sand.colors['none'][2];
                
                this.pos = newPos;
            }
        }
    }
    Sand.types  = ['sand', 'water', 'stone', 'none'];
    Sand.colors = {
        'sand': [196, 196, 9],
        'water': [28, 104, 219],
        'stone': [58, 59, 63],
        'none': [172, 177, 196]
    };
    window.Sand = Sand;
    
})();
