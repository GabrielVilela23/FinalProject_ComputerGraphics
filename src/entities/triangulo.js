export class Triangulo{
    constructor(){
        this.vertices = new Float32Array([
                            0.0, 0.5, 0.0,
                            0.5, 0.0, 0.0,
                            -0.5, 0.0, 0.0]); // Vértices que compõe o objeto
        this.positionBuffer;
    }
    createPositionBuffer(gl){
        this.positionBuffer = gl.createBuffer(); // Posição do objeto no espaço local
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
    }
    update(keyboard){

    }
    draw(gl, program){
        // Falta criar matrizes de tranformaçoes lineares que mudam a posicao dos pontos do objeto com base na lógica de cada objeto no update

        const positionLocation = gl.getAttribLocation(program, `aPosition`);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}
