export const phongDiffuseFragmentShaderSourceCode = `#version 300 es
precision mediump float;

in vec3 fragmentViewPosition;
in vec3 fragmentLightPosition;
in vec3 fragmentNormal;
in vec3 fragmentColor;

out vec4 outputColor;

struct Coefficient {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

uniform Coefficient coefficient;

// Local Illumination, page 29
void main() {
    vec3 lightVector = normalize(fragmentLightPosition - fragmentViewPosition);
    vec3 normalVector = normalize(fragmentNormal);

    vec3 ambientColor = fragmentColor * coefficient.ambient;

    float diffuseIntensity = max(dot(normalVector, lightVector), 0.);
    vec3 diffuseColor = fragmentColor * diffuseIntensity * coefficient.diffuse;

    vec3 finalColor = ambientColor + diffuseColor;

    outputColor = vec4(finalColor, 1.0);
}`;