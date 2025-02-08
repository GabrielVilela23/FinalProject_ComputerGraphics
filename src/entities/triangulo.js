import { mat4 } from 'gl-matrix';
export class Triangulo{
    constructor(){
        this.drawable = true;
        this.updatable = true;
        this.vertices = new Float32Array([
                            0.0, 0.5, 0.0,
                            0.5, 0.0, 0.0,
                            -0.5, 0.0, 0.0]); // Vértices que compõe o objeto no espaço local
        this.t_x = this.t_y = this.t_z = 0;
        this.s_x = this.s_y = this.s_z = 1;
        this.theta = 0;
        this.baricentro = mat4.create();
        this.translateMatrix = mat4.create(); 
        this.translateInverseMatrix = mat4.create();
        this.scaleMatrix = mat4.create();
        this.rotationMatrix = mat4.create()
        this.uModelMatrix = mat4.create(); // Matriz do modelo  Essa matriz é usada para transformar um objeto da sua posição local para o espaço do mundo, aplicando translações, rotações e escalas.
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
        if(keyboard.isKeyPressed("KeyR")){
            this.theta += 0.1;

        }
        mat4.translate(this.baricentro, mat4.create(), [0.0, - 0.5/3, 0]);
        mat4.translate(this.translateMatrix, mat4.create(), [this.t_x, this.t_y, this.t_z]);
        mat4.rotate(this.rotationMatrix, mat4.create(), this.theta, [0.0 , 0.0, 1.0]);
        //mat4.scale(this.scaleMatrix, mat4.create(), [this.s_x, this.s_y, this.s_z]);
        //mat4.copy(this.uModelMatrix, this.translateMatrix);
        mat4.multiply(this.uModelMatrix, mat4.create(), this.translateMatrix);
        mat4.multiply(this.uModelMatrix, this.uModelMatrix, this.rotationMatrix);
        mat4.multiply(this.uModelMatrix, this.uModelMatrix, mat4.invert(this.translateInverseMatrix, this.translateMatrix)); // Jogar para a origem, aplicar rotação e scala e voltar novamente para o ponto original
        mat4.multiply(this.uModelMatrix, this.uModelMatrix, this.translateMatrix);
        mat4.multiply(this.uModelMatrix, this.uModelMatrix, this.baricentro);
    }
    draw(gl, program,viewMatrix){ // executa varias vezes no loop
        // Falta criar matrizes de tranformaçoes lineares que mudam a posicao dos pontos do objeto com base na lógica de cada objeto no update

        const positionLocation = gl.getAttribLocation(program, `aPosition`);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);

        const uModelMatrixLocation = gl.getUniformLocation(program, "uModelMatrix");
        gl.uniformMatrix4fv(uModelMatrixLocation, false, this.uModelMatrix);
        const uViewMatrixLocation = gl.getUniformLocation(program, "uViewMatrix");
        gl.uniformMatrix4fv(uViewMatrixLocation, false, viewMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}
