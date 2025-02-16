import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

export function checkCollision(box1, box2) {
    return box1.intersectsBox(box2);
}

export function checkCollisions(scene) {
    const models = scene.children.filter(child => child.isObject3D && child.userData.boundingBox);
    for (let i = 0; i < models.length; i++) {
        for (let j = i + 1; j < models.length; j++) {
            const box1 = models[i].userData.boundingBox;
            const box2 = models[j].userData.boundingBox;

            if (box1 && box2) {
                if (box1.intersectsBox(box2)) {
                    console.log(`Colisão detectada entre ${models[i].name} e ${models[j].name}`);
                }
            } else {
                console.warn('Bounding box não encontrada para um dos modelos:', models[i].name, models[j].name);
            }
        }
    }
}
