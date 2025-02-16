export class Shader{
    constructor(gl, vertexPath, fragmentPath){
        this.gl = gl;
        this.program = null;
        this.vertexPath = vertexPath;
        this.fragmentPath = fragmentPath;
    }

    // Método estático assíncrono para criar o Shader

    static async createShader(gl, vertexPath, fragmentPath){
        const shader = new Shader(gl, vertexPath, fragmentPath);
        await shader.loadShaders(vertexPath, fragmentPath);
        return shader;
    }
    async loadShaders(vertexPath, fragmentPath){
        const gl = this.gl;
        
        // Carrega os shaders da pasta 'shaders', ou futuramente de um arquivo de configuração que podemos implementar
        const vertexSrc = await this.loadShaderFile(vertexPath);
        const fragmentSrc = await this.loadShaderFile(fragmentPath);
        if (!vertexSrc || !fragmentSrc) {
            console.error('Erro: Arquivos de shader não carregados corretamente');
            return;
        }

        // Compila os shaders
        const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexSrc);
        const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentSrc);
        
        if (!vertexShader || !fragmentShader) {
            console.error('Erro ao compilar shaders');
            return;
        }

        // Linka o programa
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        
        if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)){
            console.error("Erro ao linkar o shader program:", gl.getProgramInfoLog(this.program));
            gl.deleteProgram(this.program);
            return;
        }
        gl.useProgram(this.program);
    }
    async loadShaderFile(path){
        const response = await fetch(path);
        if(!response.ok){
            throw new Error(`Falha ao carregar o shader: $ ${path}`);
        }
        return response.text();
    }
    compileShader(type, source){
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Erro ao compilar shader:", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader; // identificador do shader, basicamente é um ponteiro para o binario criado da compilação
    }
    
}
