// Imports
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Camera, updateCameraPosition } from '../core/camera.js';
import { checkCollisions } from './collision.js';
import { addModel } from './modelLoader.js';
import { objPlayer } from './player.js';
import { createHud, removeHud } from './hud.js';
import * as THREE from 'three';

// Variáveis globais
let renderer;
let clock;
let mixers;
let scene;
let camera;
let orbit;

let cameraOption = 0;

// Variável para controlar qual dragão está sendo controlado
let currentDragon = 'dragon';

// Iniciar jogo
export function finishScene() {
    console.log('WebGL game finished!');
    initFinishScene();
}

function initFinishScene() {
    window.prod = true;
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

    // Redimensionar telas
    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Adicionar luzes à cena
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 25);
    directionalLight.position.set(10, 0, 10);
    scene.add(directionalLight);

    // Adiciona objetos na cena
    addObjetcs();

    renderer.setAnimationLoop(animate);
}

// Função para adicionar objetos na tela
function addObjetcs() {
    const dragon = new URL('../assets/eastern_dragon.glb', import.meta.url);
    const god = new URL('../assets/knight.glb', import.meta.url);
    const scenario = new URL('../assets/Nature.glb', import.meta.url);

    mixers = [];

    // Adicionar modelos à cena
    addModel(scene, mixers, dragon.href, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, 'dragon');
    addModel(scene, [], god.href, { x: 0, y: 10, z: 0 }, { x: 0.075, y: 0.075, z: 0.075 }, 'dragonFront');
    addModel(scene, mixers, scenario.href, { x: 185, y: 0, z: 120 }, { x: 100, y: 100, z: 100 }, 'scenario');
}

// Loop de animação
clock = new THREE.Clock();
function animate() {
    const delta = clock.getDelta();
    mixers.forEach((mixer) => mixer.update(delta));

    orbit.update();

    const dragon = scene.getObjectByName(currentDragon);
    updateCameraPosition(scene, camera, cameraOption, dragon ? dragon.rotation.y : 0);

    scene.traverse((child) => {
        if (child.isObject3D && child.userData.updateBoundingBox) {
            child.userData.updateBoundingBox();
        }
    });

    checkCollisions(scene);

    renderer.render(scene, camera.three);
}