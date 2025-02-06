 precision mediump float;

        attribute vec3 aPosition;
        attribute vec3 aNormal;

        varying vec3 vNormal;
        varying vec3 vSurfaceToLight;
        varying vec3 vSurfaceToView;
        
        uniform mat4 uModelMatrix;
        uniform mat4 uInverseTransposeModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;

        uniform mat4 uModelViewingProjectionMatrix;
        uniform vec3 uLightPosition;
        uniform vec3 uViewPosition;
        
        void main() {
            vNormal = mat3(uInverseTransposeModelMatrix) * aNormal;
            vec3 surfacePosition = (uModelMatrix * vec4(aPosition, 1)).xyz;
            vSurfaceToLight = uLightPosition - surfacePosition;
            vSurfaceToView = uViewPosition - surfacePosition;
            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1);
        }
