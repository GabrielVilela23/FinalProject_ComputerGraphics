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
            console.log('Modelo carregado com sucesso', loadedModel);

            // Adicionar mixer ao array global
            mixers.push(mixerInstance);

            // Definir posição inicial do modelo
            loadedModel.position.set(position.x, position.y, position.z);

            // Definir escala do modelo
            loadedModel.scale.set(scale.x, scale.y, scale.z);

            // Definir nome para facilitar busca
            loadedModel.name = name;

            if (name === 'dragon') {                
                const size = new THREE.Vector3(5, 5, 5); // Tamanho personalizado
                const center = new THREE.Vector3(); // Centro do modelo

                // Criar uma bounding box personalizada
                const boundingBox = new THREE.Box3(
                    new THREE.Vector3().copy(center).sub(size.multiplyScalar(0.5)), // min
                    new THREE.Vector3().copy(center).add(size.multiplyScalar(0.5))  // max
                );

                // Salvar a bounding box no userData do modelo
                loadedModel.userData.boundingBox = boundingBox;
                // loadedModel.geometry.boundingBox = boundingBox;

                // Criar um BoxHelper personalizado com o tamanho da bounding box
                if (window.prod === true) {
                    const boxSize = new THREE.Vector3();
                    boundingBox.getSize(boxSize); // Obter o tamanho da bounding box

                    const boxGeometry = new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z);
                    const boxEdges = new THREE.EdgesGeometry(boxGeometry);
                    const boxMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 }); // Cor amarela
                    const boxHelper = new THREE.LineSegments(boxEdges, boxMaterial);

                    // Posicionar o BoxHelper no centro da bounding box
                    const boxCenter = new THREE.Vector3();
                    boundingBox.getCenter(boxCenter);
                    boxHelper.position.copy(boxCenter);

                    // Adicionar o BoxHelper à cena
                    scene.add(boxHelper);

                    // Atualizar a bounding box manualmente no loop de renderização
                    loadedModel.userData.updateBoundingBox = () => {
                        boundingBox.setFromObject(loadedModel); // Atualizar a bounding box com base no modelo
                        boxHelper.position.copy(loadedModel.position); // Atualizar a posição do BoxHelper
                    };
                }
            }
            else {
                loadedModel.userData.boundingBox = new THREE.Box3().setFromObject(loadedModel);
                
                if (window.prod) {
                    const boxHelper = new THREE.BoxHelper(loadedModel, 0xff0000);
                    scene.add(boxHelper);
                }
            }
        },
        function (error) {
            console.error('Erro ao carregar o modelo:', error);
        }
    );
}
