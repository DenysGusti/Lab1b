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
    float F0;
    float roughness;
};

uniform Coefficient coefficient;

// Local Illumination, page 34
void main() {
    vec3 L = normalize(fragmentLightPosition - fragmentViewPosition);   // light vector
    vec3 N = normalize(fragmentNormal);  // normal vector

    vec3 ambientColor = fragmentColor * coefficient.ambient;

    float NdotL = max(dot(N, L), 0.);

    float diffuseIntensity = NdotL;
    vec3 diffuseColor = fragmentColor * diffuseIntensity * coefficient.diffuse;
    
    float specularIntensity = 0.;

    if (NdotL > 0.) {
        vec3 V = normalize(-fragmentViewPosition);  // eye/camera/view vector
        vec3 R = reflect(-L, N);    // reflection vector 2. * dot(N, L) * N - L;

        specularIntensity = pow(max(dot(R, V), 0.), coefficient.shininess);
    }

    vec3 specularColor = specularIntensity * coefficient.specular;

    vec3 finalColor = ambientColor + diffuseColor + specularColor;

    outputColor = vec4(finalColor, 1.0);
}`;