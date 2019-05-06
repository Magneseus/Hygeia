(function() {
    "use strict";
    
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
    randGen.seed = 100000;
    window.randGen = randGen;
})();
