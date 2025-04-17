export const phongSpecularFragmentShaderSourceCode = `#version 300 es
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

// Local Illumination, page 34
void main() {
    vec3 lightVector = normalize(fragmentLightPosition - fragmentViewPosition);
    vec3 normalVector = normalize(fragmentNormal);

    vec3 ambientColor = fragmentColor * coefficient.ambient;

    float diffuseIntensity = max(dot(normalVector, lightVector), 0.);
    vec3 diffuseColor = fragmentColor * diffuseIntensity * coefficient.diffuse;
    
    float specularIntensity = 0.;

    if (diffuseIntensity > 0.) {
        vec3 eyeVector = normalize(-fragmentViewPosition);
        vec3 reflectionVector = reflect(-lightVector, normalVector);    // 2. * dot(n, l) * n - l;

        specularIntensity = pow(max(dot(reflectionVector, eyeVector), 0.), coefficient.shininess);
    }

    vec3 specularColor = specularIntensity * coefficient.specular;

    vec3 finalColor = ambientColor + diffuseColor + specularColor;

    outputColor = vec4(finalColor, 1.0);
}`;