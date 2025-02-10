// modelLoader.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

export function loadModel(scene, url, onLoadCallback, onErrorCallback) {
    const loader = new GLTFLoader();
    let mixer;

    loader.load(
        url,
        function (gltf) {
            const model = gltf.scene;
            scene.add(model);

            // Criar mixer para animações
            mixer = new THREE.AnimationMixer(model);
            const clips = gltf.animations;

            // Reproduzir todas as animações
            clips.forEach(function (clip) {
                const action = mixer.clipAction(clip);
                action.play();
            });

            // Chamar o callback de sucesso
            if (onLoadCallback) onLoadCallback(model, mixer);

        },
        undefined,
        function (error) {
            // Chamar o callback de erro
            if (onErrorCallback) onErrorCallback(error);
        }
    );

    return mixer;
}
