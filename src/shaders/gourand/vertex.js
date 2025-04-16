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

struct TransformationObject {
    mat4 transformation;
};

struct Coefficient {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;    
};

uniform Viewer camera;
uniform Viewer light;

uniform TransformationObject global;
uniform TransformationObject model;

// it's easier to compute it in js
uniform mat3 normal;    // inverseTranspose(mat3(camera.view * global.transformation * model.transformation))

uniform Coefficient coefficient;

void main() {
    vec4 viewPosition = camera.view * global.transformation * model.transformation * vec4(vertexPosition, 1.0);
    gl_Position = camera.projection * viewPosition;
    
    vec3 lightVector = normalize(light.position - viewPosition.xyz);
    vec3 normalVector = normalize(normal * vertexNormal);
    
    vec3 ambientColor = vertexColor.rgb * coefficient.ambient;
    
    float diffuseIntensity = max(dot(normalVector, lightVector), 0.);
    vec3 diffuseColor = vertexColor.rgb * diffuseIntensity * coefficient.diffuse;

    fragmentColor = ambientColor + diffuseColor;      
}`;