(function() {
    "use strict";
    
    class Encoder {
        static encode(message, seed) {
            message = message.toLowerCase();
            message = message.replace(/[^a-z]/g, '');
            
            let msgArr = [];
            for (var i of message) {
                let pos = i.charCodeAt(0);
                pos -= 97;
                pos *= 2;
                msgArr.push(pos);
                console.log('pos: ' + pos);
            }
            
            randGen.setSeed(seed);
            let randNumCount = msgArr.length * 25;
            let randNumArr = [];
            for (var i = 0; i < randNumCount; i++) {
                randNumArr.push(randGen.coinFlip());
            }
            
            let numRandomTrailing = 0;
            
            // End
            for (var numTrailing = 1; numTrailing < msgArr.length; numTrailing++) {
                numRandomTrailing += numTrailing;
                
                for (var idx = 0; idx < numTrailing; idx++) {
                    let ind = (msgArr.length-1) - idx;
                    let wentLeft = randNumArr.pop();
                    
                    console.log(ind);
                    
                    if (wentLeft) {
                        if (!msgArr[ind]) { throw new Error('out of bounds!'); }
                        msgArr[ind] += 2;
                    } else {
                        if (!msgArr[ind]) { throw new Error('out of bounds!'); }
                        msgArr[ind] -= 2;
                    }
                }
            }
            
            // Middle
            while (randNumArr.length > numRandomTrailing) {
                for (var ind = msgArr.length-1; ind >= 0; ind--) {
                    let wentLeft = randNumArr.pop();
                    
                    console.log(ind);
                    
                    if (wentLeft) {
                        if (!msgArr[ind]) { throw new Error('out of bounds!'); }
                        msgArr[ind] += 2;
                    } else {
                        if (!msgArr[ind]) { throw new Error('out of bounds!'); }
                        msgArr[ind] -= 2;
                    }
                }
            }
            
            // Beginning
            for (var numTrailing = msgArr.length-2; numTrailing >= 0; numTrailing--) {
                for (var idx = 0; idx <= numTrailing; idx++) {
                    let ind = numTrailing - idx;
                    let wentLeft = randNumArr.pop();
                    
                    console.log(ind);
                    
                    if (wentLeft) {
                        if (!msgArr[ind]) { throw new Error('out of bounds! ' + ind); }
                        msgArr[ind] += 2;
                    } else {
                        if (!msgArr[ind]) { throw new Error('out of bounds! ' + ind); }
                        msgArr[ind] -= 2;
                    }
                }
            }
            
            for (var i = 0; i < msgArr.length; i++) {
                msgArr[i] /= 2;
            }
            
            return msgArr;
        }
    }
    window.Encoder = Encoder;
    
})();
