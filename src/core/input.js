export class Keyboard{
    constructor(canvas){
        this.keys = new Set();
        this.initEventListeners(canvas);
    }
    initEventListeners(canvas){
        canvas.addEventListener("keydown", (event) => this.handleKeyDown(event));
        canvas.addEventListener("keyup", (event) => this.handleKeyUp(event));
    }
    handleKeyDown(event){
        this.keys.add(event.code);
        console.log(`${event.code}`);
    }
    handleKeyUp(event){
        this.keys.delete(event.code);
        console.log(`${event.code}`);
    }
    isKeyPressed(keyCode){
        return this.keys.has(keyCode);
    }
}
