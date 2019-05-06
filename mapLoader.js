(function() {
    "use strict";
    
    class MapLoader {
        constructor (mapString) {
            this.mapString = mapString;
        }
        
        loadInto (eng) {
            this.width = 0;
            this.height = 0;
            
            let lines = this.mapString.split('\n');
            lines.reverse();
            this.height = lines.length;
            
            let x = 0;
            let y = this.height-1;
            
            for (let line of lines) {
                let grains = line.split(' ');
                
                // Check for empty lines
                if (grains.length <= 1) {
                    continue;
                }
                
                if (this.width == 0) {
                    this.width = grains.length;
                    
                    for (var i = 0; i < this.width; i++) {
                        eng.gridList.push([]);
                        for (var j = 0; j < this.height; j++) {
                            eng.gridList[i].push(null);
                        }
                    }
                }
                
                let newScale = Math.min(Math.floor(eng._canvas.width / this.width), Math.floor(eng._canvas.height / this.height));
                eng.scale = newScale;
                eng.width = eng._canvas.width/eng.scale;
                eng.height = eng._canvas.height/eng.scale;
                
                x = 0;
                for (let grain of grains) {
                    let parsedInt = parseInt(grain, 10);
                    if (isNaN(parsedInt)) {
                        // Do nothing
                    } else {
                        Sand.createSand(eng, new iVec2D(x, y), Sand.types[parsedInt]);
                    }
                    
                    x += 1;
                }
                
                y -= 1;
            }
        }
    }
    window.MapLoader = MapLoader;
    
})();
