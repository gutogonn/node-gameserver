class Vector2 {  
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    magnetude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    normalized() {
        const magnetude = this.magnetude();
        return new Vector2(this.x / magnetude, this.y / magnetude);
    }

    distance(OtherVect: Vector2){
        const direction = new Vector2();
        direction.x = OtherVect.x - this.x;
        direction.y = OtherVect.y - this.y;
        return direction.magnetude();
    }

    consoleOutput(){
        return `(${this.x}, ${this.y})`;
    }
}

export default Vector2;