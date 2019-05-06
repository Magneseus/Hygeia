(function() {
    "use strict";
    
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
            return this;
        }
        
        sub(i_vec2D) {
            if (!(i_vec2D instanceof iVec2D)) throw new Error('Invalid type for iVec2D operation.');
            this.x -= i_vec2D.x;
            this.y -= i_vec2D.y;
            return this;
        }
        
        dot(i_vec2D) {
            if (!(i_vec2D instanceof iVec2D)) throw new Error('Invalid type for iVec2D operation.');
            return (this.x * i_vec2D.x) + (this.y * i_vec2D.y);
        }
        
        scalarMul(scalar) {
            if (!Number.isInteger(scalar)) throw new Error('Invalid number type for iVec2D!');
            this.x *= scalar;
            this.y *= scalar;
            return this;
        }
        
        scalarDiv(scalar) {
            if (!Number.isInteger(scalar)) throw new Error('Invalid number type for iVec2D!');
            this.x = Math.floor(this.x / scalar);
            this.y = Math.floor(this.y / scalar);
            return this;
        }
    }
    window.iVec2D = iVec2D;
    
})();
