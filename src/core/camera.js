export class Camera{
  constructor(P0, P_ref, V){
    this.P0 = P0;
    this.P_ref = P_ref;
    this.V = V;
  } 
  set3dViewingMatrix(P0,P_ref,V){
    let matrix = [];
    let N = [
      P0[0] - P_ref[0],
      P0[1] - P_ref[1],
      P0[2] - P_ref[2],
    ];
    let n = unitVector(N);
    let u = unitVector(crossProduct(V,n));
    let v = crossProduct(n,u);
  
    let T = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      -P0[0], -P0[1], -P0[2], 1,
    ];
    let R = [
      u[0], v[0], n[0],  0,
      u[1], v[1], n[1],  0,
      u[2], v[2], n[2],  0,
         0,    0,    0,  1,
    ];
  
    matrix = m4.multiply(R,T);
    return matrix;
  }
  
  ortographicProjection(xw_min,xw_max,yw_min,yw_max,z_near,z_far){
    let matrix = [
      2/(xw_max-xw_min), 0, 0, 0,
      0, 2/(yw_max-yw_min), 0, 0,
      0, 0, -2/(z_near-z_far), 0,
      -(xw_max+xw_min)/(xw_max-xw_min), -(yw_max+yw_min)/(yw_max-yw_min), (z_near+z_far)/(z_near-z_far), 1,
    ];
    return matrix;
  }
  
  perspectiveProjection(xw_min,xw_max,yw_min,yw_max,z_near,z_far){
    let matrix = [
      -(2*z_near)/(xw_max-xw_min), 0, 0, 0,
      0, -(2*z_near)/(yw_max-yw_min), 0, 0,
      (xw_max+xw_min)/(xw_max-xw_min), (yw_max+yw_min)/(yw_max-yw_min), (z_near+z_far)/(z_near-z_far), -1,
      0, 0, -1, 0,
    ];
    return matrix;
  }
  
  crossProduct(v1,v2){
    let result = [
        v1[1]*v2[2] - v1[2]*v2[1],
        v1[2]*v2[0] - v1[0]*v2[2],
        v1[0]*v2[1] - v1[1]*v2[0]
    ];
    return result;
  }
  
  unitVector(v){ 
    let result = [];
    let vModulus = vectorModulus(v);
    return v.map(function(x) { return x/vModulus; });
  }
}
