export class Scene{
    constructor(){
        this.objects = [];
    }
    addObject(object, gl){
        object.createPositionBuffer(gl);
        this.objects.push(object);
    }
    update(keyboard){
        this.objects.forEach((obj) => obj.update(keyboard));
    }
    draw(gl, program){
        this.objects.forEach((obj) => obj.draw(gl, program));
    }
}