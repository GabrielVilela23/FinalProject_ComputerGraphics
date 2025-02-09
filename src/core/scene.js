export class Scene{
    constructor(){
        this.objects_drawable = [];
        this.objects_updatable = [];
    }
    addObject(object, gl){
        if(object.drawable){
            object.createPositionBuffer(gl);
            this.objects_drawable.push(object);
        }
        if(object.updatable){
            this.objects_updatable.push(object);
        }
    }
    update(keyboard){
        this.objects_updatable.forEach((obj) => obj.update(keyboard));
    }
    draw(gl, program, viewMatrix, projectionMatrix){ // Vou ter que passar a camera como parâmetro
        this.objects_drawable.forEach((obj) => obj.draw(gl, program, viewMatrix, projectionMatrix));
    }
}