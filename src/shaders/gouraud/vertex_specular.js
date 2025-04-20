export const gouraudSpecularVertexShaderSourceCode = `#version 300 es
precision mediump float;

in vec3 vertexPosition;
in vec3 vertexColor;
in vec3 vertexNormal;

out vec3 fragmentColor;

struct Viewer {
    vec3 position;
    mat4 projection;
    mat4 view;
    vec3 direction;
};

struct Coefficient {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
    float F0;
    float roughness;
    float innerCutoff;
    float outerCutoff;
};

uniform Coefficient coefficient;

uniform Viewer camera;
uniform Viewer light;

// global * local or only global
uniform mat4 transformation;
// inverseTranspose(mat3(camera.view * transformation))
uniform mat3 normal;    // it's better to compute it in js

uniform int lightType;  // 0 - point light, 1 - spotlight

// Local Illumination, page 34
void main() {
    // lighting calculations happen in view space
    vec4 viewPosition = camera.view * transformation * vec4(vertexPosition, 1.0);
    vec4 lightPosition = camera.view * vec4(light.position, 1.0);

    vec3 L = normalize(lightPosition.xyz - viewPosition.xyz);   // light vector
    vec3 N = normalize(normal * vertexNormal);  // normal vector

    vec3 ambientColor = vertexColor * coefficient.ambient;

    float NdotL = max(dot(N, L), 0.);

    float diffuseIntensity = NdotL;
    vec3 diffuseColor = vertexColor * diffuseIntensity * coefficient.diffuse;

    float specularIntensity = 0.;

    if (NdotL > 0.) {
        vec3 V = normalize(-viewPosition.xyz);  // eye/camera/view vector
        vec3 R = reflect(-L, N);    // reflection vector 2. * dot(N, L) * N - L;

        specularIntensity = pow(max(dot(R, V), 0.), coefficient.shininess);
    }

    vec3 specularColor = specularIntensity * coefficient.specular;

    float lightIntensity = 1.;

    // taken from https://learnopengl.com/book/book_preview.pdf, page 147
    if (lightType == 1) {
        float theta = max(dot(-L, normalize(light.direction)), 0.);
        float epsilon = coefficient.innerCutoff - coefficient.outerCutoff;
        lightIntensity = clamp((theta - coefficient.outerCutoff) / epsilon, 0., 1.);
    }

    fragmentColor = ambientColor + (diffuseColor + specularColor) * lightIntensity;

    gl_Position = camera.projection * viewPosition;
}`;