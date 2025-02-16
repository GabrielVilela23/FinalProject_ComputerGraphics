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
            loadedModel.name = name;  // Definir o nome aqui (ex: "dragon")
        },
        function (error) {
            console.error('Erro ao carregar o modelo:', error);
        }
    );
}
