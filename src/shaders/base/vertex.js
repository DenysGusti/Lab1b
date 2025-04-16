export const baseVertexShaderSourceCode = `#version 300 es
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

struct TransformationObject {
    mat4 transformation;
};

uniform Viewer camera;
uniform Viewer light;

uniform TransformationObject global;
uniform TransformationObject model;
// it's easier to compute it in js
uniform mat3 normal;    // inverseTranspose(mat3(camera.view * global.transformation * model.transformation))

void main() {
    fragmentColor = vertexColor;

    gl_Position = camera.projection * camera.view * global.transformation * model.transformation * vec4(vertexPosition, 1.0);
}`;