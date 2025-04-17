export const gourandVertexShaderSourceCode = `#version 300 es
precision mediump float;

in vec3 vertexPosition;
in vec3 vertexColor;
in vec3 vertexNormal;

out vec3 fragmentColor;

struct Viewer {
    vec3 position;
    mat4 projection;
    mat4 view;
};

struct Coefficient {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;    
};

uniform Coefficient coefficient;

uniform Viewer camera;
uniform Viewer light;

// global * local or only global
uniform mat4 transformation;
// inverseTranspose(mat3(camera.view * transformation))
uniform mat3 normal;    // it's better to compute it in js

void main() {
    // lighting calculations happen in view space
    vec4 viewPosition = camera.view * transformation * vec4(vertexPosition, 1.0);
    vec4 lightPosition = camera.view * vec4(light.position, 1.0);

    vec3 lightVector = normalize(lightPosition.xyz - viewPosition.xyz);
    vec3 normalVector = normalize(normal * vertexNormal);

    vec3 ambientColor = vertexColor * coefficient.ambient;

    float diffuseIntensity = max(dot(normalVector, lightVector), 0.);
    vec3 diffuseColor = vertexColor * diffuseIntensity * coefficient.diffuse;

    fragmentColor = ambientColor + diffuseColor;      
    gl_Position = camera.projection * viewPosition;
}`;