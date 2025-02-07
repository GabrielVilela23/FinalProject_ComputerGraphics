import { mat4 } from 'gl-matrix';
export class Triangulo{
    constructor(){
        this.vertices = new Float32Array([
                            0.0, 0.5, 0.0,
                            0.5, 0.0, 0.0,
                            -0.5, 0.0, 0.0]); // Vértices que compõe o objeto no espaço local
        this.t_x = this.t_y = this.t_z = 0;
        this.s_x = this.s_y = this.s_z = 1;
        this.theta = 0;

        this.translateMatrix = mat4.create(); 
        this.scaleMatrix = mat4.create();
        this.rotationMatrix = mat4.create()
        this.uModelMatrix = mat4.create(); // Matriz do modelo  Essa matriz é usada para transformar um objeto da sua posição local para o espaço do mundo, aplicando translações, rotações e escalas.
        mat4.mul(this.uModelMatrix, this.translateMatrix, this.rotationMatrix);
        mat4.mul(this.uModelMatrix, this.uModelMatrix, this.scaleMatrix);
        
        this.positionBuffer;
    }
    createPositionBuffer(gl){ // Executa só uma vez quando a cena adiciona o objeto
        this.positionBuffer = gl.createBuffer(); // Posição do objeto no espaço local
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
    }
    update(keyboard){// Executa varias vezes no loop
        if(keyboard.isKeyPressed("ArrowUp")){
            this.t_y += 0.1;
            console.log("Pressionou com força o.O");

        }
        if(keyboard.isKeyPressed("ArrowDown")){
            this.t_y -= 0.1;
        }
        if(keyboard.isKeyPressed("ArrowLeft")){
            this.t_x -= 0.1;
        }
        if(keyboard.isKeyPressed("ArrowRight")){
            this.t_x += 0.1;
        }
        mat4.translate(this.translateMatrix, mat4.create(), [this.t_x, this.t_y, this.t_z]);
        mat4.copy(this.uModelMatrix, this.translateMatrix);
    }
    draw(gl, program){ // executa varias vezes no loop
        // Falta criar matrizes de tranformaçoes lineares que mudam a posicao dos pontos do objeto com base na lógica de cada objeto no update

        const positionLocation = gl.getAttribLocation(program, `aPosition`);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);

        const uModelMatrixLocation = gl.getUniformLocation(program, "uModelMatrix");
        gl.uniformMatrix4fv(uModelMatrixLocation, false, this.uModelMatrix);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}
