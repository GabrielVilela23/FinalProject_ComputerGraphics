export class Triangulo{
    constructor(vertex, initial_position){
        this.vertex = vertex // Vértices que compõe o objeto
        this.initial_position = initial_position; // Matriz que calcula a posicao inicial do objeto na cena(vertex shader)
    }
    update(keyboard){

    }
    draw(gl, program){
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertex, gl.STATIC_DRAW);
        const positionAttributeLocation = gl.getAttribLocation(program, "aPosition");
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        
    }
}
