(function() {
    "use strict";
    
    class Sand {
        constructor(pos, type, eng, size=1) {
            if (!Sand.types.includes(type)) throw new Error('Invalid Sand type!');
            if (!(pos instanceof iVec2D)) throw new Error('Sand requires an iVec2D for position.');
            if (!(eng instanceof Engine)) throw new Error('Sand requires an Engine type for eng.');
            
            this.pos = pos;
            this.type = type;
            this.eng = eng;
            this.gridList = this.eng.gridList;
            this.gridImgData = this.eng.gridImgData.data;
            this.pixelSize = size;
            this.isSpawner = false;
            
            if (this.type.endsWith('_spawner')) {
                this.isSpawner = true;
                this.spawnType = this.type.slice(0, this.type.indexOf('_'));
                this.spawnVec = (new iVec2D(0, 1)).add(this.pos);4
            }
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
            if (this.isSpawner) {
                this.eng.queueCreateSand(this.spawnVec, this.spawnType);
                
                return false;
            }
            
            let newPos = this.checkBelow();
            if (newPos !== this.pos) {
                this.gridList[newPos.x][newPos.y] = this;
                this.gridList[this.pos.x][this.pos.y] = null;
                
                this.setPixel(newPos.x, newPos.y, Sand.colors[this.type]);
                this.setPixel(this.pos.x, this.pos.y, Sand.colors['none']);
                
                this.pos = newPos;
                
                return true;
            }
            
            return false;
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
                    let newPos = ((newX + xDelta) + ((newY + yDelta) * (this.eng.gridImgData.width))) * 4;
                    this.gridImgData[newPos] = col[0];
                    this.gridImgData[newPos+1] = col[1];
                    this.gridImgData[newPos+2] = col[2];
                }
            }
        }
        
        static createSand(eng, pos, type) {
            if (eng.gridList[pos.x][pos.y] !== null) {
                if (type === 'none') {
                    let tmp = eng.gridList[pos.x][pos.y];
                    tmp.setPixel(pos.x, pos.y, Sand.colors['none']);
                    eng.gridList[pos.x][pos.y] = null;
                    eng.sandList.splice(eng.sandList.indexOf(tmp), 1);
                    
                    // Remove pixel
                    return true;
                }
                
                // Can't spawn
                return false;
            }
            
            // Error
            if (type === 'none') {
                return false;
            }
            
            // Real spawn
            let s = new Sand(
                pos,
                type,
                eng,
                eng.scale
            );
            
            eng.gridList[pos.x][pos.y] = s;
            eng.sandList.push(s);
            s.renderTick();
            
            return true;
        }
    }
    Sand.types  = ['none', 'sand', 'water', 'stone', 'sand_spawner', 'water_spawner'];
    Sand.colors = {
        'none': [172, 177, 196],
        'sand': [231, 234, 18],
        'water': [28, 104, 219],
        'stone': [58, 59, 63],
        'sand_spawner': [105, 107, 0],
        'water_spawner': [7, 47, 132]
    };
    window.Sand = Sand;
    
})();
