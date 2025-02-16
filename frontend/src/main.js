import { Shader } from "./core/shaders.js"
import { Logic } from "./core/logic.js";
import { Camera } from "./core/camera.js"
import { Scene } from "./core/scene.js";
import { Triangulo } from "./entities/triangulo.js";
import { Keyboard } from "./core/input.js"
import { Quadrado } from "./entities/quadrado.js";
import { Dragon } from "./entities/dragon.js";
async function main(){
    const {canvas, gl, program} = await initWebGL();    
    
    // Primeiro limpamos a tela com a cor que queremos, como se fosse um quadro
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
   
    // Criamos uma cena e definimos os objetos que queremos inserir nela e os desenhamos
    const scene = new Scene();
    const camera =  new Camera(
                    new Float32Array([0.0, 3.0, 3.0]),
                    new Float32Array([0.0, 0.0, 0.0]),
                    new Float32Array([0.0, 1.0, 0]),
                    canvas
                    );
    const logic = new Logic(camera, scene); // é tipo o loop do jogo com uma cena e uma camera inicial
    //const triangulo = new Triangulo();
    //scene.addObject(triangulo, gl);
    
    const quadrado = new Quadrado();
    scene.addObject(quadrado, gl);

    try{
        const dragon = await Dragon.CreateDragon("src/assets/eastern_dragon.glb");
        console.log("dragao com array buffer: ", dragon.arrayBuffer);
    }catch(error){
        console.error("deu esse erro:", error);
    }
    scene.draw(gl, program, camera.viewMatrix, camera.projectionMatrix);

    // Atualizamos a lógica/posição e redesenhamos os objetos que estão na cena tudo dentro desse loop
    
    const keyboard = new Keyboard(canvas);

    logic.loop(gl, program, keyboard);

    requestAnimationFrame((timestamp) => logic.loop(gl, program, keyboard)); 
}

main();

function initCanvas(){
    const canvas = document.querySelector("#canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.addEventListener("click", () => {
        canvas.focus();
    });
    canvas.addEventListener("keydown", (event) => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
            event.preventDefault(); // Impede o scroll da página se estiver dentro do canvas
        }});
    return canvas;
}

function initGL(canvas){
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });    
    if (!gl) {
        throw new Error('WebGL not supported');
    }
    return gl;

}
async function initWebGL(){
    const canvas = initCanvas();
    const gl = initGL(canvas);
    const shader = await Shader.createShader(gl, "src/shaders/vertex_test.vert", "src/shaders/fragment_test.frag");
    var program = shader.program;
    if(!program){
        console.error("Erro: programa não foi criado corretamente.");
        return;
    }
    gl.enable(gl.DEPTH_TEST);
return {canvas, gl, program};
}
