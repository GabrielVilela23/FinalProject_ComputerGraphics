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
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(10, 10, 10);

// Controles orbitais
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// Adicionar grid à cena
const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

// Adicionar luzes à cena
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Luz ambiente
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Luz direcional
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
addModel(scene, mixers, dragon.href, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }); // Escala padrão
addModel(scene, mixers, donut.href, { x: -5, y: 0, z: -5 }, { x: 2, y: 2, z: 2 }); // Escala 50%
addModel(scene, mixers, candy.href, { x: -10, y: 0, z: -5 }, { x: 0.05, y: 0.05, z: 0.05 });
addModel(scene, mixers, chocolate.href, { x: -10, y: 0, z: 1 }, { x: 1, y: 1, z: 1 });
addModel(scene, mixers, oreo.href, { x: -2, y: 0, z: 2 }, { x: 2, y: 2, z: 2 });

// Loop de animação
const clock = new THREE.Clock();
function animate() {
    const delta = clock.getDelta();

    // Atualizar todos os mixers
    mixers.forEach((mixer) => mixer.update(delta));

    orbit.update();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// Responsividade: Redimensionar tela
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
