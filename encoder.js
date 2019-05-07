(function() {
    "use strict";
    
    class Encoder {
        static encode(message, seed, len, offsetFunc) {
            message = message.toLowerCase();
            message = message.replace(/[^a-z]/g, '');
            
            let msgArr = [];
            for (var i of message) {
                let pos = i.charCodeAt(0);
                pos -= 97;
                pos *= 2;
                msgArr.push(pos);
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
                    
                    if (wentLeft) {
                        if (msgArr[ind] === null) { throw new Error('out of bounds! ' + ind); }
                        msgArr[ind] += 1;
                    } else {
                        if (msgArr[ind] === null) { throw new Error('out of bounds! ' + ind); }
                        msgArr[ind] -= 1;
                    }
                }
            }
            
            // Middle
            while (randNumArr.length > numRandomTrailing) {
                for (var ind = msgArr.length-1; ind >= 0; ind--) {
                    let wentLeft = randNumArr.pop();
                    
                    if (wentLeft) {
                        if (msgArr[ind] === null) { throw new Error('out of bounds! ' + ind); }
                        msgArr[ind] += 1;
                    } else {
                        if (msgArr[ind] === null) { throw new Error('out of bounds! ' + ind); }
                        msgArr[ind] -= 1;
                    }
                }
            }
            
            // Beginning
            for (var numTrailing = msgArr.length-2; numTrailing >= 0; numTrailing--) {
                for (var idx = 0; idx <= numTrailing; idx++) {
                    let ind = numTrailing - idx;
                    let wentLeft = randNumArr.pop();
                    
                    if (wentLeft) {
                        if (msgArr[ind] === null) { throw new Error('out of bounds! ' + ind); }
                        msgArr[ind] += 1;
                    } else {
                        if (msgArr[ind] === null) { throw new Error('out of bounds! ' + ind); }
                        msgArr[ind] -= 1;
                    }
                }
            }
            
            let emptyString = '';
            for (var i = 0; i < len; i++) {
                emptyString = emptyString.concat('. ');
            }
            emptyString = emptyString.slice(0, emptyString.length-1);
            
            let stringOut = '';
            for (var i = msgArr.length-1; i >= 0; i--) {
                let ind = offsetFunc(msgArr[i]);
                
                let line = emptyString.slice(0, ind-1);
                line = line.concat('1');
                line = line.concat(emptyString.slice(ind, emptyString.length));
                
                stringOut = stringOut.concat(emptyString);
                stringOut = stringOut.concat('\n');
                stringOut = stringOut.concat(line);
                stringOut = stringOut.concat('\n');
            }
            
            return stringOut;
        }
    }
    window.Encoder = Encoder;
    
})();
