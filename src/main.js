import { Scene } from "./core/scene.js";
import { Shader } from "./core/shaders.js"
import { Triangulo } from "./entities/triangulo.js";
import { Keyboard } from "./core/input.js"


async function main(){
    const {canvas, gl, program} = await initWebGL();    
    
    // Primeiro limpamos a tela com a cor que queremos, como se fosse um quadro
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
   
    // Criamos uma cena e definimos os objetos que queremos inserir nela e os desenhamos

    const scene = new Scene();
    const triangulo = new Triangulo();
    scene.addObject(triangulo, gl);
    scene.draw(gl, program);

    // Atualizamos a lógica/posição e redesenhamos os objetos que estão na cena tudo dentro desse loop
    
    const keyboard = new Keyboard(canvas);

    function loop(){
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        scene.update(keyboard);
        scene.draw(gl, program);
        requestAnimationFrame(loop);
            // console.log("Rodando um frame");
    }
    requestAnimationFrame(loop);
}

main();

function initCanvas(){
    const canvas = document.querySelector("#canvas");
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