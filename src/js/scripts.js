import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Menu inicial
document.getElementById('startGame').addEventListener('click', function () {
    document.getElementById('menu').style.display = 'none';
    // chamar inicio do jogo aqui ??
});

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

// Função modular para carregar modelo GLB
function loadModel(scene, url, onLoad, onError) {
    const assetLoader = new GLTFLoader();

    assetLoader.load(
        url,
        function (gltf) {
            const model = gltf.scene;
            scene.add(model);

            // Criar mixer para animações
            const mixer = new THREE.AnimationMixer(model);
            const clips = gltf.animations;

            // Reproduzir todas as animações
            clips.forEach(function (clip) {
                const action = mixer.clipAction(clip);
                action.play();
            });

            // Retornar modelo e mixer para manipulação
            if (onLoad) onLoad(model, mixer);
        },
        undefined,
        onError
    );
}

// URL do modelo GLB
const monkeyUrl = new URL('../assets/eastern_dragon.glb', import.meta.url);

// Variável para rastrear o modelo carregado
let model = null;
let mixer = null;

// Carregar modelo GLB com a função do módulo
loadModel(
    scene,
    monkeyUrl.href,
    function (loadedModel, mixerInstance) {
        // Configurações iniciais
        model = loadedModel; // Atribuir o modelo carregado
        mixer = mixerInstance;

        console.log('Modelo carregado com sucesso', model);
        model.position.set(0, 0, 0); // Posição inicial no centro da tela
    },
    function (error) {
        console.error('Erro ao carregar o modelo:', error);
    }
);

// Variáveis para rastrear teclas pressionadas
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
};

// Listener para pressionar teclas
window.addEventListener('keydown', (event) => {
    if (keys.hasOwnProperty(event.key)) keys[event.key] = true;
});

// Listener para soltar teclas
window.addEventListener('keyup', (event) => {
    if (keys.hasOwnProperty(event.key)) keys[event.key] = false;
});

// Loop de animação
const clock = new THREE.Clock();
function animate() {
    if (mixer) mixer.update(clock.getDelta());

    // Mover o modelo carregado com base nas teclas pressionadas
    if (model) {
        if (keys.w) model.position.z -= 0.1; // Mover para frente
        if (keys.s) model.position.z += 0.1; // Mover para trás
        if (keys.a) model.position.x -= 0.1; // Mover para a esquerda
        if (keys.d) model.position.x += 0.1; // Mover para a direita
    }

    orbit.update(); // Atualizar os controles de órbita
    renderer.render(scene, camera); // Renderizar cena
}

renderer.setAnimationLoop(animate);

// Responsividade: Redimensionar tela
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
