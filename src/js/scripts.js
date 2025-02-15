import { loadModel, addModel } from './modelLoader.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa3a3a3);
document.body.appendChild(renderer.domElement);

// Cena
const scene = new THREE.Scene();

// Câmera
const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(10, 10, 10);

// Controles orbitais
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();          // Atualiza os controles

// Adicionar luzes à cena
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Luz ambiente
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Luz direcional
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Endereços dos modelos
const dragon = new URL('../assets/eastern_dragon.glb', import.meta.url);
const donut = new URL('../assets/Donut.glb', import.meta.url);
const candy = new URL('../assets/CandyCane.glb', import.meta.url);
const chocolate = new URL('../assets/ChocolateBar.glb', import.meta.url);
const oreo = new URL('../assets/Oreos.glb', import.meta.url);

// Array global para armazenar mixers
const mixers = [];

// Adicionar modelos à cena com diferentes escalas
addModel(scene, mixers, dragon.href, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, "dragon");
addModel(scene, mixers, donut.href, { x: -5, y: 0, z: -5 }, { x: 3, y: 3, z: 3 }, "donut");
addModel(scene, mixers, candy.href, { x: -10, y: 0, z: -5 }, { x: 0.05, y: 0.05, z: 0.05 }, "candy");
addModel(scene, mixers, chocolate.href, { x: -10, y: 0, z: 1 }, { x: 2, y: 2, z: 2 }, "chocolate");
addModel(scene, mixers, oreo.href, { x: -2, y: 0, z: 2 }, { x: 4, y: 4, z: 4 }, "oreo");

// Funções de movimentação do dragão
function moveDragonX(distance) {
    const dragon = scene.getObjectByName("dragon");  // Buscar o modelo pelo nome
    if (dragon) {
        dragon.position.x += distance;
    }
}

function moveDragonY(distance) {
    const dragon = scene.getObjectByName("dragon");  // Buscar o modelo pelo nome
    if (dragon) {
        dragon.position.y += distance;
    }
}

function moveDragonZ(distance) {
    const dragon = scene.getObjectByName("dragon");  // Buscar o modelo pelo nome
    if (dragon) {
        dragon.position.z += distance;
    }
}

// Funções de rotação do dragão
function rotateDragonY(angle) {
    const dragon = scene.getObjectByName("dragon");  // Buscar o modelo pelo nome
    if (dragon) {
        dragon.rotation.y += angle;
    }
}

function rotateDragonX(angle) {
    const dragon = scene.getObjectByName("dragon");  // Buscar o modelo pelo nome
    if (dragon) {
        dragon.rotation.x += angle;
    }
}


// Responsividade: Redimensionar tela
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Variáveis para controlar a rotação
let targetRotation = 0;  // Rotações alvo para o dragão
const rotationSpeed = 0.05; // Velocidade da rotação suave

document.addEventListener('keydown', (event) => {
    const step = 0.1;

    const dragon = scene.getObjectByName("dragon");  // Buscar o modelo do dragão
    if (!dragon) return;

    switch (event.key) {
        case 'w':  // Mover para frente e rotacionar suavemente para frente
            dragon.position.z -= step;
            targetRotation = 0;  // Rota para frente
            break;
        case 's':  // Mover para trás e rotacionar suavemente para trás
            dragon.position.z += step;
            targetRotation = Math.PI; // Rota para trás
            break;
        case 'a':  // Mover para a esquerda e rotacionar suavemente para a esquerda
            dragon.position.x -= step;
            targetRotation = Math.PI / 2;  // Rota 90° para a esquerda
            break;
        case 'd':  // Mover para a direita e rotacionar suavemente para a direita
            dragon.position.x += step;
            targetRotation = -Math.PI / 2;  // Rota 90° para a direita
            break;
    }
});

// Função para suavizar a rotação do dragão
function smoothRotation() {
    const dragon = scene.getObjectByName("dragon");
    if (!dragon) return;

    // Fazendo a rotação de forma suave
    const deltaRotation = targetRotation - dragon.rotation.y;
    const sign = Math.sign(deltaRotation);
    const rotationAmount = Math.min(Math.abs(deltaRotation), rotationSpeed);
    dragon.rotation.y += sign * rotationAmount;
}

/// Loop de animação
const clock = new THREE.Clock();
function animate() {
    const delta = clock.getDelta();

    mixers.forEach((mixer) => mixer.update(delta));
    smoothRotation();  // Chama a suavização da rotação
    orbit.update();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
