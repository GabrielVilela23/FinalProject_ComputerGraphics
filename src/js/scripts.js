// Imports
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Camera, updateCameraPosition } from '../core/camera.js';
import { checkCollisions } from './collision.js';
import { addModel } from './modelLoader.js';
import { objPlayer } from './player.js';
import { createHud, removeHud } from './hud.js';
import { Screen } from './screen.js';
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

// Iniciar jogo
function startGame() {
    console.log('WebGL game started!');
    initGame();
}

function initGame() {
    // Lógica do Jogo
    window.prod = true;

    window.player = new objPlayer();
    createHud(window.player);

    const deafultVelocity = 0.5;
    let key_lock = false;

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

    // Controles
    document.addEventListener('keyup', function (event) {
        key_lock = false;
    });

    document.addEventListener('keydown', function (event) {
        const dragon = scene.getObjectByName('dragon');
        if (!dragon) return;

        // Troca de câmera
        if (event.key === 'r' || event.key === 'R') {
            cameraOption = (cameraOption + 1) % 2;
        }

        // Movimentação e rotação
        if (event.key === 'w' || event.key === 'W') {
            // Movimento para frente
            const direction = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), dragon.rotation.y);
            dragon.position.add(direction.multiplyScalar(deafultVelocity));
        }

        if (event.key === 's' || event.key === 'S') {
            // Movimento para trás
            const direction = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), dragon.rotation.y);
            dragon.position.add(direction.multiplyScalar(deafultVelocity));
        }

        if ((event.key === 'a' || event.key === 'A') && !key_lock) {
            // Rotaciona 45 graus para a esquerda
            targetRotation += Math.PI / 5; // 36 graus em radianos
            key_lock = true;
        }

        if ((event.key === 'd' || event.key === 'D') && !key_lock) {
            // Rotaciona 45 graus para a direita
            targetRotation -= Math.PI / 5; // -36 graus em radianos
            key_lock = true;
        }
    });

    // Redimensionar telas
    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

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
    const scenario = new URL('../assets/Nature.glb', import.meta.url);
    const espeha = new URL('../assets/esfera.glb', import.meta.url);

    // Array global para armazenar mixers
    mixers = [];

    // Adicionar modelos à cena com diferentes escalas
    addModel(scene, mixers, dragon.href, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, 'dragon');
    addModel(scene, mixers, donut.href, { x: -5, y: 0, z: 50 }, { x: 3, y: 3, z: 3 }, 'collectible');
    addModel(scene, mixers, donut.href, { x: -10, y: 0, z: 50 }, { x: 3, y: 3, z: 3 }, 'collectible');
    addModel(scene, mixers, donut.href, { x: -15, y: 0, z: 50 }, { x: 3, y: 3, z: 3 }, 'collectible');
    addModel(scene, mixers, donut.href, { x: -20, y: 0, z: 50 }, { x: 3, y: 3, z: 3 }, 'collectible');
    addModel(scene, mixers, donut.href, { x: -25, y: 0, z: 50 }, { x: 3, y: 3, z: 3 }, 'collectible');

    addModel(scene, mixers, oreo.href, { x: 5, y: 0, z: 50 }, { x: 10, y: 10, z: 10 }, 'oreo');
    addModel(scene, mixers, oreo.href, { x: 10, y: 0, z: 50 }, { x: 10, y: 10, z: 10 }, 'oreo');
    addModel(scene, mixers, oreo.href, { x: 15, y: 0, z: 50 }, { x: 10, y: 10, z: 10 }, 'oreo');
    addModel(scene, mixers, oreo.href, { x: 20, y: 0, z: 50 }, { x: 10, y: 10, z: 10 }, 'oreo');
    addModel(scene, mixers, oreo.href, { x: 25, y: 0, z: 50 }, { x: 10, y: 10, z: 10 }, 'oreo');

    addModel(scene, mixers, scenario.href, { x: 185, y: 0, z: 120 }, { x: 100, y: 100, z: 100 }, 'scenario');

    addModel(scene, mixers, espeha.href, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, 'new');

    renderer.setAnimationLoop(animate);
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
        renderer.setAnimationLoop(null);
        let canvas = document.querySelector('canvas');
        canvas.remove();
        removeHud();
        screen.showGameOverScreen();
    }

    //Lógica de Win
    if (player.spheres >= 5) {
        renderer.setAnimationLoop(null);
        let canvas = document.querySelector('canvas');
        canvas.remove();
        removeHud();
        screen.showWinScreen();
    }

    const delta = clock.getDelta();

    mixers.forEach((mixer) => mixer.update(delta));
    smoothRotation(); // Chama a suavização da rotação

    // Atualização: Orbitais
    orbit.update();

    // Atualização: Posição da câmera
    const dragon = scene.getObjectByName('dragon');
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
