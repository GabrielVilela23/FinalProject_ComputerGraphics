function drawCube(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta += 1.0;

    let modelMatrix = m4.identity();
    modelMatrix = m4.yRotate(modelMatrix,degToRad(theta));
    modelMatrix = m4.translate(modelMatrix,0.0,0.0,1.0);
    modelMatrix = m4.scale(modelMatrix,0.5,0.5,0.5);
    let matrix = m4.identity();
    matrix = m4.multiply(matrix,viewingProjctionMatrix);
    matrix = m4.multiply(matrix,modelMatrix);
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
}

