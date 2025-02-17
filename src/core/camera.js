import { mat4 } from 'gl-matrix';
import * as THREE from 'three';

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

function topDownVision(scene, camera) {
    const dragon = scene.getObjectByName('dragon');
    if (!dragon) return;

    const cameraOffset = new THREE.Vector3(0, 40, 0);
    camera.three.position.copy(dragon.position).add(cameraOffset);

    camera.three.lookAt(dragon.position);
    camera.three.rotation.z = THREE.MathUtils.degToRad(-180);
}

function thirdPersonVision(scene, camera, dragonRotation) {
    const dragon = scene.getObjectByName('dragon');
    if (!dragon) return;

    // Offset da câmera em relação ao dragão
    const cameraOffset = new THREE.Vector3(0, 15, -15);
    const offsetPosition = dragon.position.clone().add(cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), dragonRotation));
    camera.three.position.copy(offsetPosition);

    // Ponto de foco da câmera (ligeiramente à frente do dragão)
    const lookAtOffset = new THREE.Vector3(0, 2, 5);
    camera.three.lookAt(dragon.position.clone().add(lookAtOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), dragonRotation)));
}

export function updateCameraPosition(scene, camera, option = 0, dragonRotation = 0) {
    if (option === 1) {
        topDownVision(scene, camera);
    } else {
        thirdPersonVision(scene, camera, dragonRotation);
    }
}