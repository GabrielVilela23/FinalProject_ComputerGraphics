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

export function addModel(scene, mixers, url, position, scale = { x: 1, y: 1, z: 1 }, name) {
    const mixer = loadModel(
        scene,
        url,
        function (loadedModel, mixerInstance) {
            // Adicionar mixer ao array global
            mixers.push(mixerInstance);

            // Definir posição inicial do modelo
            loadedModel.position.set(position.x, position.y, position.z);

            // Definir escala do modelo
            loadedModel.scale.set(scale.x, scale.y, scale.z);

            // Definir nome para facilitar busca
            loadedModel.name = name;

            if (name === 'dragon') {
                const boundingBox = new THREE.Box3();
                const boxSize = new THREE.Vector3(3, 3, 3);
                const boxOffset = new THREE.Vector3(0, 1.5, 13);

                const boxHelper = new THREE.Box3Helper(boundingBox, 0xffff00);
                const boxHelper2 = new THREE.BoxHelper(loadedModel, 0x00ff00);

                if (window.prod === true) {
                    scene.add(boxHelper);
                    scene.add(boxHelper2);
                }

                loadedModel.userData.boundingBox = boundingBox;
                loadedModel.userData.boxHelper = boxHelper;
                loadedModel.userData.boxHelper2 = boxHelper2;

                loadedModel.userData.updateBoundingBox = () => {
                    const rotatedOffset = boxOffset.clone().applyQuaternion(loadedModel.quaternion);
                    boundingBox.setFromCenterAndSize(loadedModel.position.clone().add(rotatedOffset), boxSize);

                    if (window.prod === true) {
                        boxHelper.box.copy(boundingBox);
                        boxHelper2.update();
                    }
                };
            } else {
                loadedModel.userData.boundingBox = new THREE.Box3().setFromObject(loadedModel);

                if (window.prod) {
                    const color = name === 'collectible' ? 0x0000ff : 0xff0000;
                    const boxHelper = new THREE.BoxHelper(loadedModel, color);
                    scene.add(boxHelper);
                }
            }
        },
        function (error) {
            console.error('Erro ao carregar o modelo:', error);
        }
    );
}
