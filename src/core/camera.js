import { mat4 } from 'gl-matrix';


export class Camera{
  constructor(P0, P_ref, V, canvas){
    this.P0 = P0;
    this.P_ref = P_ref;
    this.V = V;
    this.viewMatrix = mat4.create();
    this.translateMatrix = mat4.create(); 
    this.rotationMatrix = mat4.create();
    this.projectionMatrix = mat4.create();
    this.set3dViewingMatrix();
    this.set3dPerspectiveMatrix(canvas);
  }
  update(){

  }
  set3dViewingMatrix(){
    if (!this.P0 || !this.P_ref || !this.V) {
      console.error("Erro: P0, P_ref ou V não estão definidos corretamente!");
      return;
    }
    mat4.lookAt(this.viewMatrix, this.P0, this.P_ref, this.V);
  }
  set3dPerspectiveMatrix(canvas){
    mat4.perspective(
    this.projectionMatrix,
    Math.PI / 4 , 
    canvas.width / canvas.height, 
    0.1, 100.0);
  } 
}