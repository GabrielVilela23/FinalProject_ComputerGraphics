import { mat4 } from "gl-matrix";

export class Quadrado{
    constructor(){
        this.vertices = new Float32Array([
            // Frente
                -0.5, -0.5,  0.5,  // V0
                0.5, -0.5,  0.5,  // V1
                0.5,  0.5,  0.5,  // V2
                -0.5,  0.5,  0.5,  // V3
            // Trás
                -0.5, -0.5, -0.5,  // V4
                0.5, -0.5, -0.5,  // V5
                0.5,  0.5, -0.5,  // V6
                -0.5,  0.5, -0.5   // V7
                ]);
        this.indices = new Uint16Array([
    0, 1, 2,  2, 3, 0, // Frente
    4, 5, 6,  6, 7, 4, // Trás
    0, 4, 7,  7, 3, 0, // Esquerda
    1, 5, 6,  6, 2, 1, // Direita
    3, 2, 6,  6, 7, 3, // Topo
    0, 1, 5,  5, 4, 0  // Fundo
        ]);
        this.positionBuffer;
        this.indexBuffer;
        this.rotationMatrix = mat4.create();
        this.uModelMatrix = mat4.create(); // Matriz do modelo  Essa matriz é usada para transformar um objeto da sua posição local para o espaço do mundo, aplicando translações, rotações e escalas.
        this.theta = 0;
    }
    createPositionBuffer(gl){
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
    }
    update(keyboard){
        if(keyboard.isKeyPressed("KeyR")){
            this.theta += 0.1;
        }
        this.uModelMatrix = mat4.create();
        mat4.rotate(this.rotationMatrix, mat4.create(), this.theta, [0.0 , 0.0, 1.0]);
        mat4.multiply(this.uModelMatrix, this.uModelMatrix, this.rotationMatrix);

    }
    draw(gl, program, viewMatrix, projectionMatrix){
        const positionLocation = gl.getAttribLocation(program, "aPosition");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0,0)


        const uModelMatrixLocation = gl.getUniformLocation(program, "uModelMatrix");
        gl.uniformMatrix4fv(uModelMatrixLocation, false, this.uModelMatrix);
        const uViewMatrixLocation = gl.getUniformLocation(program, "uViewMatrix");
        gl.uniformMatrix4fv(uViewMatrixLocation, false, viewMatrix);
        const uProjectionMatrixLocation = gl.getUniformLocation(program, "uProjectionMatrix");
        gl.uniformMatrix4fv(uProjectionMatrixLocation, false, projectionMatrix);


        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }
}
