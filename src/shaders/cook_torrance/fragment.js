export const cookTorranceFragmentShaderSourceCode = `#version 300 es
precision mediump float;

#define PI 3.14159265

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

// taken from https://www.cs.cornell.edu/courses/cs5625/2013sp/lectures/Lec2ShadingModelsWeb.pdf
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
        vec3 H = normalize(L + V);  // half vector

        float NdotH = max(dot(N, H), 0.);
        float NdotV = max(dot(N, V), 0.);
        float VdotH = max(dot(V, H), 0.);

        // Schlick’s approximation of Fresnel
        float F = coefficient.F0 + (1. - coefficient.F0) * pow(1. - VdotH, 5.);

        // Facet Distribution by Beckmann
        float m_2 = coefficient.roughness * coefficient.roughness;
        // -tan^2 a = -sin^2 a / cos^2 a = (cos^2 a - 1) / cos^2 a = (N.H * N.H - 1) / (N.H * N.H)
        float D = 1. / (4. * m_2 * pow(NdotH, 4.)) * exp((NdotH * NdotH - 1.) / (m_2 * NdotH * NdotH));

        // Masking and Shadowing
        float G = min(1., min((2. * NdotH * NdotV) / VdotH, (2. * NdotH * NdotL) / VdotH));

        specularIntensity = clamp((F * D * G) / (PI *NdotL * NdotV), 0., 1.);
    }

    vec3 specularColor = specularIntensity * coefficient.specular;

    float lightIntensity = 1.;

    if (lightType == 1) {
        float theta = max(dot(-L, normalize(fragmentLightDirection)), 0.);
        float epsilon = coefficient.innerCutoff - coefficient.outerCutoff;
        lightIntensity = clamp((theta - coefficient.outerCutoff) / epsilon, 0., 1.);
    }

    vec3 finalColor = ambientColor + (diffuseColor + specularColor) * lightIntensity;

    outputColor = vec4(finalColor, 1.0);
}`;