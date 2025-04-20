export const phongDiffuseFragmentShaderSourceCode = `#version 300 es
precision mediump float;

in vec3 fragmentViewPosition;
in vec3 fragmentLightPosition;
in vec3 fragmentLightDirection;
in vec3 fragmentNormal;
in vec3 fragmentColor;

out vec4 outputColor;

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

uniform int lightType;  // 0 - point light, 1 - spotlight

// Local Illumination, page 29
void main() {
    vec3 L = normalize(fragmentLightPosition - fragmentViewPosition);   // light vector
    vec3 N = normalize(fragmentNormal);  // normal vector

    vec3 ambientColor = fragmentColor * coefficient.ambient;

    float NdotL = max(dot(N, L), 0.);

    float diffuseIntensity = NdotL;
    vec3 diffuseColor = fragmentColor * diffuseIntensity * coefficient.diffuse;

    float lightIntensity = 1.;

    // taken from https://learnopengl.com/book/book_preview.pdf, page 147
    if (lightType == 1) {
        float theta = max(dot(-L, normalize(fragmentLightDirection)), 0.);
        float epsilon = coefficient.innerCutoff - coefficient.outerCutoff;
        lightIntensity = clamp((theta - coefficient.outerCutoff) / epsilon, 0., 1.);
    }

    vec3 finalColor = ambientColor + diffuseColor * lightIntensity;

    outputColor = vec4(finalColor, 1.0);
}`;