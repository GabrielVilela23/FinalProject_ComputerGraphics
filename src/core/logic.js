// A lógica do loop do jogo, responsável por por exemplo, criar novos objetos na cena com base na lógica do nosso código

export class Logic{
    constructor(initialCam = undefined, initialScene = undefined){
        this.currentCam = initialCam;
        this.currentScene = initialScene;
    }
    loop(gl, program, keyboard){
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Com base no tempo ir criando os inimigos
        this.currentScene.update(keyboard);
        this.currentScene.draw(gl, program);

        requestAnimationFrame((timestamp) => this.loop(gl, program, keyboard)); 
            // console.log("Rodando um frame");
    }
}