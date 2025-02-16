import { mat4 } from 'gl-matrix';
import * as THREE from 'three';
const cameraDistance = 25;
const cameraHeight = 20;

export class Camera {
    constructor(P0, P_ref, V, canvas) {
        this.P0 = P0;
        this.P_ref = P_ref;
        this.V = V;
        this.viewMatrix = mat4.create();
        this.translateMatrix = mat4.create();
        this.rotationMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
        this.canvas = canvas;
        this.set3dViewingMatrix();
        this.set3dPerspectiveMatrix(canvas);
        this.three = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
        this.three.position.set(...P0);
        this.three.lookAt(new THREE.Vector3(...P_ref));
    }
    update() {
        this.set3dViewingMatrix();
    }
    set3dViewingMatrix() {
        mat4.lookAt(this.viewMatrix, this.P0, this.P_ref, this.V);
    }
    set3dPerspectiveMatrix(canvas) {
        mat4.perspective(
            this.projectionMatrix,
            Math.PI / 4,
            canvas.width / canvas.height,
            0.1, 100.0
        );
    }
}

export function updateCameraPosition(scene, camera) {
    const dragon = scene.getObjectByName('dragon');
    if (!dragon) return;

    const cameraOffset = new THREE.Vector3(3, cameraHeight, -cameraDistance);
    camera.three.position.copy(dragon.position).add(cameraOffset);
    
    const forwardDirection = new THREE.Vector3(0, 0, 1);
    const lookAtPosition = camera.three.position.clone().add(forwardDirection);
    camera.three.lookAt(lookAtPosition)
    camera.three.rotation.x = THREE.MathUtils.degToRad(220);
    return camera;
}
