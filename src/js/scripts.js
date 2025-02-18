// Imports
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Camera, updateCameraPosition } from '../core/camera.js';
import { checkCollisions } from './collision.js';
import { addModel } from './modelLoader.js';
import { objPlayer } from './player.js';
import { createHud, removeHud } from './hud.js';
import { Screen } from './screen.js';
import { finishScene } from './final.js';
import * as THREE from 'three';

//Tela
const screen = new Screen();
document.addEventListener('startGame', () => {
    startGame();
});
screen.showMenu();

// Variáveis globais (uteis pra recriar cena ok, confia)
let renderer;
let clock;
let mixers;
let scene;
let camera;
let orbit;

let cameraOption = 0;

// Variáveis para controlar a rotação
let targetRotation = 0; // Rotações alvo para o dragão
const rotationSpeed = 0.1; // Velocidade da rotação suave

//Variáveis de iluminação
let isAmbientLightOn = true;
let isDirectionalLightOn = true;
let ambientLight;
let directionalLight;

//Velocidade
const defaultVelocity = 0.75;

// Iniciar jogo
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

    // Adicionar luzes à cena
    ambientLight = new THREE.AmbientLight(0xffffff, 1); // Luz ambiente
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Luz direcional
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    //Adiciona objetos na cena
    addObjetcs();

    renderer.setAnimationLoop(animate);
}

// Controles
let keysPressed = {};

document.addEventListener('keyup', function (event) {
    const dragon = scene.getObjectByName('dragon');
    if (!dragon) return;

    if (event.key === 'a' || event.key === 'A') {
        targetRotation = dragon.rotation.y;
    }

    if (event.key === 'd' || event.key === 'D') {
        targetRotation = dragon.rotation.y;
    }

    //hack de perder
    if (event.key === 'ç') {
        player.takeDamage(5);
    }

    //hack de ganhar
    if (event.key === 'l') {
        player.collectLavaLamps(5);
    }
});

document.addEventListener('keydown', function (event) {
    keysPressed[event.key] = true;
});

document.addEventListener('keyup', function (event) {
    delete keysPressed[event.key];
});

document.addEventListener('keydown', function (event) {
    const dragon = scene.getObjectByName('dragon');
    if (!dragon) return;

    // Troca de câmera
    if (keysPressed['r'] || keysPressed['R']) {
        cameraOption = (cameraOption + 1) % 2;
    }

    // Movimentação e rotação
    if (keysPressed['a'] || keysPressed['A']) {
        targetRotation += Math.PI / 18; // 10 graus em radianos
    }

    if (keysPressed['d'] || keysPressed['D']) {
        targetRotation -= Math.PI / 18; // -10 graus em radianos
    }

    // Alternar luz ambiente com a tecla 1
    if (event.key === '1') {
        toggleAmbientLight();
    }

    // Alternar luz direcional com a tecla 2
    if (event.key === '2') {
        toggleDirectionalLight();
    }
});

// Redimensionar telas
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//Função para adicionar objetos na tela
function addObjetcs() {
    // Endereços dos modelos
    const dragon = new URL('../assets/eastern_dragon.glb', import.meta.url);
    const donut = new URL('../assets/Donut.glb', import.meta.url);
    const candy = new URL('../assets/CandyCane.glb', import.meta.url);
    const chocolate = new URL('../assets/ChocolateBar.glb', import.meta.url);
    const oreo = new URL('../assets/Oreos.glb', import.meta.url);
    const scenario = new URL('../assets/Nature.glb', import.meta.url);
    const lavaLamp = new URL('../assets/lavaLamp.glb', import.meta.url);

    // Array global para armazenar mixers
    mixers = [];

    // Adicionar modelos à cena com diferentes escalas
    addModel(scene, mixers, dragon.href, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, 'dragon');

    addModel(scene, mixers, lavaLamp.href, { x: 300, y: 0, z: 220 }, { x: 10, y: 10, z: 10 }, 'collectible');
    addModel(scene, mixers, lavaLamp.href, { x: 50, y: 0, z: 220 }, { x: 10, y: 10, z: 10 }, 'collectible');
    addModel(scene, mixers, lavaLamp.href, { x: 150, y: 0, z: -50 }, { x: 10, y: 10, z: 10 }, 'collectible');
    addModel(scene, mixers, lavaLamp.href, { x: 170, y: 0, z: 115 }, { x: 10, y: 10, z: 10 }, 'collectible');
    addModel(scene, mixers, lavaLamp.href, { x: 300, y: 0, z: 100 }, { x: 10, y: 10, z: 10 }, 'collectible');

    addModel(scene, mixers, oreo.href, { x: 25, y: 0, z: 35 }, { x: 10, y: 10, z: 10 }, 'oreo');
    addModel(scene, mixers, oreo.href, { x: 70, y: 0, z: 25 }, { x: 10, y: 10, z: 10 }, 'oreo');
    addModel(scene, mixers, donut.href, { x: 170, y: 0, z: 20 }, { x: 10, y: 10, z: 10 }, 'oreo');
    addModel(scene, mixers, donut.href, { x: 135, y: 0, z: 90 }, { x: 10, y: 10, z: 10 }, 'oreo');
    addModel(scene, mixers, candy.href, { x: 75, y: 0, z: 170 }, { x: 0.1, y: 0.1, z: 0.1 }, 'oreo');
    addModel(scene, mixers, candy.href, { x: 270, y: 0, z: 80 }, { x: 0.1, y: 0.1, z: 0.1 }, 'oreo');
    addModel(scene, mixers, chocolate.href, { x: 260, y: 0, z: 180 }, { x: 10, y: 10, z: 10 }, 'oreo');
    addModel(scene, mixers, chocolate.href, { x: 155, y: 0, z: 195 }, { x: 10, y: 10, z: 10 }, 'oreo');
    addModel(scene, mixers, oreo.href, { x: 270, y: 0, z: 130 }, { x: 10, y: 10, z: 10 }, 'oreo');
    addModel(scene, mixers, oreo.href, { x: 115, y: 0, z: 115 }, { x: 10, y: 10, z: 10 }, 'oreo');

    addModel(scene, mixers, scenario.href, { x: 185, y: 0, z: 120 }, { x: 100, y: 100, z: 100 }, 'scenario');
}

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

/// Loop de animação
clock = new THREE.Clock();
function animate() {
    //Lógica de Game Over
    if (player.health <= 0) {
        gameOver();
    }

    //Lógica de Win
    if (player.lavaLamps >= 5) {
        winGame();
    }

    //Move o dragão para frente sempre
    const dragon = scene.getObjectByName('dragon');
    if (dragon) {
        const direction = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), dragon.rotation.y);
        dragon.position.add(direction.multiplyScalar(defaultVelocity));
    }

    const delta = clock.getDelta();

    mixers.forEach((mixer) => mixer.update(delta));
    smoothRotation(); // Chama a suavização da rotação

    // Atualização: Orbitais
    orbit.update();

    // Atualização: Posição da câmera
    // const dragon = scene.getObjectByName('dragon');
    updateCameraPosition(scene, camera, cameraOption, dragon ? dragon.rotation.y : 0);

    // Atualização: Posição da caixa de colissão dos modelos
    scene.traverse((child) => {
        if (child.isObject3D && child.userData.updateBoundingBox) {
            child.userData.updateBoundingBox();
        }
    });

    // Atualização: Verificação se houve colissão entre os modelos
    checkCollisions(scene);

    // Render
    renderer.render(scene, camera.three);
}

// Função para alternar o estado da luz ambiente
function toggleAmbientLight() {
    isAmbientLightOn = !isAmbientLightOn;
    ambientLight.visible = isAmbientLightOn;
}

// Função para alternar o estado da luz direcional
function toggleDirectionalLight() {
    isDirectionalLightOn = !isDirectionalLightOn;
    directionalLight.visible = isDirectionalLightOn;
}

//Função para WinGame
function winGame() {
    resetGame()
    finishScene();
    setTimeout(() => screen.showWinScreen(), 3000);
}

// Função para GameOver
function gameOver() {
    resetGame();
    screen.showGameOverScreen();
}

function resetGame() {
    renderer.setAnimationLoop(null);
    let canvas = document.querySelector('canvas');
    canvas.remove();
    removeHud();
    targetRotation = 0;
}