(function() {
    "use strict";
    let canvas;
    let context;
    let fileSelector;
    let mapString = null;
    let simulation;
    let simTickRate = 10;
    let mouseDrawing = false;
    let mouseCoords = {x: 0, y: 0};
    let startSeed = 1;
    let countStruct = {};
    
    for (var i = 0; i < 26; i++) {
        countStruct[i.toString()] = 0;
    }

    window.addEventListener("load", function() {
        canvas = document.getElementById('mainCanvas');
        context = canvas.getContext("2d");
        
        // Initialize engine
        simulation = new Engine(canvas, context);
        
        // Setup mouse movement
        canvas.addEventListener('mousedown', args => {
            mouseDrawing = true;
            mouseCoords = getMousePos(canvas, args);
        });
        canvas.addEventListener('mousemove', args => {
            mouseCoords = getMousePos(canvas, args);
        });
        canvas.addEventListener('mouseup', args => {
            mouseDrawing = false;
        });
        canvas.addEventListener('mouseout', args => {
            mouseDrawing = false;
        });
        document.addEventListener('keydown', args => {
            simulation.onKeyboardDown(args);
        });
        
        // Setup file loader
        fileSelector = document.getElementById('fileSelector');
        fileSelector.addEventListener('change', handleMapFile);
        
        // Start render tick
        requestAnimationFrame(renderTick);
        
        // Start sim tick
        if (simTickRate >= 10) {
            window.setInterval(simTick, simTickRate);
        } else {
            window.setZeroTimeout(simTick);
        }
    });

    function handleMapFile() {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            mapString = e.target.result;
            simulation.reset(new MapLoader(mapString));
        };
        
        fileReader.readAsText(fileSelector.files[0]);
    }

    function simTick() {
        //simulation.renderTick(canvas, context);
        
        if (mouseDrawing) simulation.onMouseDown(mouseCoords);
        
        let simChanged = simulation.simTick();
        
        if (mapString !== null) {
            if (!simChanged) {
                let grains = simulation.sandList;
                let output = grains.reduce((acc, cur) => {
                    if (cur.type === 'sand') {
                        let idx = cur.pos.x.toString();
                        idx -= 1;
                        idx /= 2;
                        idx -= 5;
                        if (Object.keys(acc).includes(idx)) {
                            acc[idx] += 1;
                        } else {
                            acc[idx] = 1;
                        }
                    }
                    
                    return acc;
                },
                {});
                
                if (startSeed % 100 == 0) { console.log('Seed { ' + startSeed + ' } completed simulation. ' + JSON.stringify(output)); }
                
                startSeed += 1;
                randGen.setSeed(startSeed);
                simulation.reset(new MapLoader(mapString));
            }
        }
        
        if (simTickRate < 10) {
            window.setZeroTimeout(simTick);
        }
    }

    function renderTick() {
        //simTick();
        simulation.renderTick(canvas, context);
        requestAnimationFrame(renderTick);
    }

    // https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
    function  getMousePos(canvas, evt) {
        let rect = canvas.getBoundingClientRect(); // abs. size of element
        let scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for X
        let scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

        return {
            x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
            y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
    }
})();
