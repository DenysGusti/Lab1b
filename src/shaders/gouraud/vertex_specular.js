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
};

struct Coefficient {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
    float F0;
    float roughness;
};

uniform Coefficient coefficient;

uniform Viewer camera;
uniform Viewer light;

// global * local or only global
uniform mat4 transformation;
// inverseTranspose(mat3(camera.view * transformation))
uniform mat3 normal;    // it's better to compute it in js

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

    fragmentColor = ambientColor + diffuseColor + specularColor;

    gl_Position = camera.projection * viewPosition;
}`;