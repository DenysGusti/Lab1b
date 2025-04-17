export const phongVertexShaderSourceCode = `#version 300 es
precision mediump float;

in vec3 vertexPosition;
in vec3 vertexColor;
in vec3 vertexNormal;

out vec3 fragmentViewPosition;
out vec3 fragmentLightPosition;
out vec3 fragmentNormal;
out vec3 fragmentColor;

struct Viewer {
    vec3 position;
    mat4 projection;
    mat4 view;
};

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

    fragmentViewPosition = viewPosition.xyz;
    fragmentLightPosition = lightPosition.xyz;
    fragmentNormal = normal * vertexNormal;
    fragmentColor = vertexColor;

    gl_Position = camera.projection * viewPosition;
}`;