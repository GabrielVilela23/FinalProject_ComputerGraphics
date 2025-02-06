precision mediump float;

        varying vec3 vNormal;
        varying vec3 vSurfaceToLight;
        varying vec3 vSurfaceToView;

        uniform vec3 uAmbientReflection;
        uniform vec3 uDiffuseReflection;
        uniform vec3 uSpecularReflection;

        uniform float uShininess;
        
        void main() {
            gl_FragColor = vec4(uDiffuseReflection, 1);

            vec3 normal = normalize(vNormal);
            vec3 surfaceToLightDirection = normalize(vSurfaceToLight);
            vec3 surfaceToViewDirection = normalize(vSurfaceToView);
            vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

            float light = dot(surfaceToLightDirection,normal);
            float specular = 0.0;
            if (light > 0.0) {
              specular = pow(dot(normal, halfVector), uShininess);
            }

            gl_FragColor.rgb = 0.4*uAmbientReflection + 0.6*light*uDiffuseReflection;
            gl_FragColor.rgb += specular*uSpecularReflection;
        }
