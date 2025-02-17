// Imports
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Camera, updateCameraPosition } from '../core/camera.js';
import { checkCollisions } from './collision.js';
import { addModel } from './modelLoader.js';
import { objPlayer } from './player.js';
import { createHud } from './hud.js';
import { Screen } from './screen.js';
import * as THREE from 'three';

const screen = new Screen();

document.addEventListener('startGame', () => {
    startGame();
});

screen.showMenu();

let renderer;
let clock;
let mixers;
let scene;
let camera;
let orbit;

function startGame() {
    console.log('WebGL game started!');
    initGame();
}

function initGame() {
    // Lógica do Jogo
    window.prod = false;
    window.player = new objPlayer();
    createHud(window.player);

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xa3a3a3);
    document.body.appendChild(renderer.domElement);

    // Cena
    scene = new THREE.Scene();

    // Camera
    const P0 = [10, 10, 10];
    const P_ref = [2, 1, 1];
    const V = [0, 1, 0];
    camera = new Camera(P0, P_ref, V, renderer.domElement);

    // Orbitais
    orbit = new OrbitControls(camera.three, renderer.domElement);
    orbit.update();

    /// Loop de animação

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
    mixers = [];

    // Adicionar modelos à cena com diferentes escalas
    addModel(scene, mixers, dragon.href, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, 'dragon');
    addModel(scene, mixers, donut.href, { x: -5, y: 0, z: 11 }, { x: 3, y: 3, z: 3 }, 'collectible');
    addModel(scene, mixers, donut.href, { x: -10, y: 0, z: 11 }, { x: 3, y: 3, z: 3 }, 'collectible');
    addModel(scene, mixers, donut.href, { x: -15, y: 0, z: 11 }, { x: 3, y: 3, z: 3 }, 'collectible');
    addModel(scene, mixers, donut.href, { x: -20, y: 0, z: 11 }, { x: 3, y: 3, z: 3 }, 'collectible');
    addModel(scene, mixers, donut.href, { x: -25, y: 0, z: 11 }, { x: 3, y: 3, z: 3 }, 'collectible');

    addModel(scene, mixers, oreo.href, { x: 5, y: 0, z: 11 }, { x: 10, y: 10, z: 10 }, 'oreo');
    addModel(scene, mixers, oreo.href, { x: 10, y: 0, z: 11 }, { x: 10, y: 10, z: 10 }, 'oreo');
    addModel(scene, mixers, oreo.href, { x: 15, y: 0, z: 11 }, { x: 10, y: 10, z: 10 }, 'oreo');
    addModel(scene, mixers, oreo.href, { x: 20, y: 0, z: 11 }, { x: 10, y: 10, z: 10 }, 'oreo');
    addModel(scene, mixers, oreo.href, { x: 25, y: 0, z: 11 }, { x: 10, y: 10, z: 10 }, 'oreo');

    renderer.setAnimationLoop(animate);
}

function animate() {
    if (player.health <= 0) {
        renderer.setAnimationLoop(null);
        let canvas = document.querySelector('canvas');
        canvas.remove();
        screen.showGameOverScreen();
    }

    if (player.spheres >= 5) {
        renderer.setAnimationLoop(null);
        let canvas = document.querySelector('canvas');
        canvas.remove();
        screen.showWinScreen();
    }

    clock = new THREE.Clock();
    const delta = clock.getDelta();

    mixers.forEach((mixer) => mixer.update(delta));
    smoothRotation(); // Chama a suavização da rotação

    // Atualização: Orbitais
    orbit.update();

    // Atulização: Posição da câmera
    updateCameraPosition(scene, camera);

    // Atulização: Posição da caixa de colissão dos modelos
    scene.traverse((child) => {
        if (child.isObject3D && child.userData.updateBoundingBox) {
            child.userData.updateBoundingBox();
        }
    });

    // Atulização: Verificação se houve colissão entre os modelos
    checkCollisions(scene);

    // Render
    renderer.render(scene, camera.three);
}

// Funções de movimentação do dragão
function moveDragonX(distance) {
    const dragon = scene.getObjectByName('dragon'); // Buscar o modelo pelo nome
    if (dragon) {
        dragon.position.x += distance;
    }
}

function moveDragonY(distance) {
    const dragon = scene.getObjectByName('dragon'); // Buscar o modelo pelo nome
    if (dragon) {
        dragon.position.y += distance;
    }
}

function moveDragonZ(distance) {
    const dragon = scene.getObjectByName('dragon'); // Buscar o modelo pelo nome
    if (dragon) {
        dragon.position.z += distance;
    }
}

// Funções de rotação do dragão
function rotateDragonY(angle) {
    const dragon = scene.getObjectByName('dragon'); // Buscar o modelo pelo nome
    if (dragon) {
        dragon.rotation.y += angle;
    }
}

function rotateDragonX(angle) {
    const dragon = scene.getObjectByName('dragon'); // Buscar o modelo pelo nome
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
let targetRotation = 0; // Rotações alvo para o dragão
const rotationSpeed = 0.05; // Velocidade da rotação suave

document.addEventListener('keydown', (event) => {
    const step = 0.3; // Passo de movimento

    const dragon = scene.getObjectByName('dragon'); // Buscar o modelo do dragão
    if (!dragon) return;

    switch (event.key) {
        case 'w': // Mover para frente
            dragon.position.z += step;
            break;
        case 's': // Mover para trás
            dragon.position.z -= step;
            break;
        case 'a': // Mover para a esquerda
            dragon.position.x += step;
            break;
        case 'd': // Mover para a direita
            dragon.position.x -= step;
            break;
    }
});

// Função para suavizar a rotação do dragão
function smoothRotation() {
    const dragon = scene.getObjectByName('dragon');
    if (!dragon) return;

    // Fazendo a rotação de forma suave
    const deltaRotation = targetRotation - dragon.rotation.y;
    const sign = Math.sign(deltaRotation);
    const rotationAmount = Math.min(Math.abs(deltaRotation), rotationSpeed);
    dragon.rotation.y += sign * rotationAmount;
}

