import { mat4 } from 'gl-matrix';


export class Camera{
  constructor(P0, P_ref, V){
    this.P0 = P0;
    this.P_ref = P_ref;
    this.V = V;
    this.viewMatrix = mat4.create();
    this.translateMatrix = mat4.create(); 
    this.rotationMatrix = mat4.create();
    this.set3dViewingMatrix();
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
  
  // ortographicProjection(xw_min,xw_max,yw_min,yw_max,z_near,z_far){
  //   let matrix = [
  //     2/(xw_max-xw_min), 0, 0, 0,
  //     0, 2/(yw_max-yw_min), 0, 0,
  //     0, 0, -2/(z_near-z_far), 0,
  //     -(xw_max+xw_min)/(xw_max-xw_min), -(yw_max+yw_min)/(yw_max-yw_min), (z_near+z_far)/(z_near-z_far), 1,
  //   ];
  //   return matrix;
  // }
  
  // perspectiveProjection(xw_min,xw_max,yw_min,yw_max,z_near,z_far){
  //   let matrix = [
  //     -(2*z_near)/(xw_max-xw_min), 0, 0, 0,
  //     0, -(2*z_near)/(yw_max-yw_min), 0, 0,
  //     (xw_max+xw_min)/(xw_max-xw_min), (yw_max+yw_min)/(yw_max-yw_min), (z_near+z_far)/(z_near-z_far), -1,
  //     0, 0, -1, 0,
  //   ];
  //   return matrix;
  // }
  
 
  }
/*function unitVector(v){ 
    let vModulus = vectorModulus(v);
    return v.map(function(x) { return x/vModulus; });
  }
function crossProduct(v1,v2){
    let result = [
        v1[1]*v2[2] - v1[2]*v2[1],
        v1[2]*v2[0] - v1[0]*v2[2],
        v1[0]*v2[1] - v1[1]*v2[0]
    ];
    return result;
  }
 
function vectorModulus(v){
    return Math.sqrt(Math.pow(v[0],2)+Math.pow(v[1],2)+Math.pow(v[2],2));
} */