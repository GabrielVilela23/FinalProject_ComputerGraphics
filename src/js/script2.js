import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadModel } from './modelLoader.js'; // Importa o módulo

// URL do modelo GLB
const monkeyUrl = new URL('../assets/eastern_dragon.glb', import.meta.url);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xA3A3A3);
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

// Carregar modelo GLB com a função do módulo
let mixer;
mixer = loadModel(
    scene,
    monkeyUrl.href,
    function (model, mixerInstance) {
        // Manipulações do modelo podem ser feitas aqui
        mixer = mixerInstance;
        console.log('Modelo carregado com sucesso', model);
    },
    function (error) {
        console.error('Erro ao carregar o modelo:', error);
    }
);

// Loop de animação
const clock = new THREE.Clock();
function animate() {
    if (mixer) mixer.update(clock.getDelta());
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// Responsividade: Redimensionar tela
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
