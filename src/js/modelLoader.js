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
                const boundingBox = new THREE.Box3().setFromObject(loadedModel);
                const headOffset = new THREE.Vector3(0, 1.5, 10);
                const reductionZ = 31.0;

                boundingBox.min.z += reductionZ / 2;
                boundingBox.max.z -= reductionZ / 2;
                boundingBox.min.add(headOffset);
                boundingBox.max.add(headOffset);
                loadedModel.userData.boundingBox = boundingBox;
            
                if (window.prod === true) {
                    const boxHelper = new THREE.Box3Helper(boundingBox, 0xffff00);
                    scene.add(boxHelper);
            
                    loadedModel.userData.updateBoundingBox = () => {
                        boundingBox.setFromObject(loadedModel);
            
                        boundingBox.min.z += reductionZ / 2;
                        boundingBox.max.z -= reductionZ / 2;
                        boundingBox.min.add(headOffset);
                        boundingBox.max.add(headOffset);
            
                        boxHelper.box = boundingBox;
                    };
                }
            }            
            else {
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
