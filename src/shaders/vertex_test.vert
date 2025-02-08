precision mediump float;
attribute vec3 aPosition; // Posição do vértice no espaço local

uniform mat4 uModelMatrix; // Matriz de transformação do objeto no mundo
uniform mat4 uViewMatrix;
        
        void main() {
            vec4 worldPosition = uModelMatrix * vec4(aPosition, 1.0);
            gl_Position = uViewMatrix * worldPosition;
        }
