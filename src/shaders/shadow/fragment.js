export const shadowFragmentShaderSourceCode = `#version 300 es
precision mediump float;

in vec3 fragmentPosition;

out vec4 outputColor;

uniform struct Coefficient {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
    float F0;
    float roughness;
    float innerCutoff;
    float outerCutoff;
    vec2 shadowClipNearFar;
    float bias;
} coefficient;

uniform struct Flag {
    int enableSpecular;
    int enableCookTorrance;
    int enableSpotlight;
    int enableShadow;
} flag;

uniform struct Light {
    vec3 position;
    vec3 direction;
} light;

uniform struct Viewer {
    mat4 projection;
    mat4 view;
} viewer;

uniform mat4 transformationMatrix;  // global * local or only global
// (it's better to compute it in js)
uniform mat3 normalMatrix;  // inverseTranspose(mat3(transformationMatrix))

uniform samplerCube lightShadowMap;

void main() {
    float len = length(fragmentPosition - light.position);
    float lightShadowDistance =
        (len - coefficient.shadowClipNearFar.x) / (coefficient.shadowClipNearFar.y - coefficient.shadowClipNearFar.x);

    outputColor = vec4(lightShadowDistance, lightShadowDistance, lightShadowDistance, 1.);
}`;