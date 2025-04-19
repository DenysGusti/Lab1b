export const baseVertexShaderSourceCode = `#version 300 es
precision mediump float;

in vec3 vertexPosition;
in vec3 vertexColor;

out vec3 fragmentColor;

struct Viewer {
    vec3 position;
    mat4 projection;
    mat4 view;
};

uniform Viewer camera;

// global * local or only global
uniform mat4 transformation;
// inverseTranspose(mat3(camera.view * transformation))
uniform mat3 normal;    // it's better to compute it in js

void main() {
    fragmentColor = vertexColor;

    gl_Position = camera.projection * camera.view * transformation * vec4(vertexPosition, 1.0);
}`;