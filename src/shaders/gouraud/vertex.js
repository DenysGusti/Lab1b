export const gouraudVertexShaderSourceCode = `#version 300 es
precision mediump float;

#define PI 3.14159265

in vec3 vertexPosition;
in vec3 vertexColor;
in vec3 vertexNormal;

out vec3 fragmentColor;

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

// Local Illumination, page 34
float computePhongSpecularIntensity(vec3 V, vec3 L, vec3 N) {
    vec3 R = reflect(-L, N);    // reflection vector 2. * dot(N, L) * N - L;

    float RdotV = max(dot(R, V), 0.);

    return pow(RdotV, coefficient.shininess);
}

// taken from https://www.cs.cornell.edu/courses/cs5625/2013sp/lectures/Lec2ShadingModelsWeb.pdf
float computeCookTorranceSpecularIntensity(vec3 V, vec3 L, vec3 N, float NdotL) {
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

    return clamp((F * D * G) / (PI * NdotL * NdotV), 0., 1.);
}

// taken from https://learnopengl.com/book/book_preview.pdf, page 147
float computeSpotlightIntensity(vec3 L) {
    float theta = max(dot(-L, normalize(light.direction)), 0.);
    float epsilon = coefficient.innerCutoff - coefficient.outerCutoff;

    return clamp((theta - coefficient.outerCutoff) / epsilon, 0., 1.);
}

// taken from https://youtu.be/watch?v=UnFudL21Uq4
float computeShadowIntensity(vec3 position, vec3 L) {
    float len = length(position - light.position);
    float lightShadowDistance =
        (len - coefficient.shadowClipNearFar.x) / (coefficient.shadowClipNearFar.y - coefficient.shadowClipNearFar.x);

    float shadowMapValue = texture(lightShadowMap, -L).r;

    return shadowMapValue + coefficient.bias >= lightShadowDistance ? 1. : 0.;
}

vec3 computeFinalColor(vec3 position, vec3 color, vec3 normal) {
    vec3 L = normalize(light.position - position);   // light vector
    vec3 N = normalize(normal);  // normal vector

    vec3 ambientColor = color * coefficient.ambient;

    // Local Illumination, page 29
    float NdotL = max(dot(N, L), 0.);
    float diffuseIntensity = NdotL;
    vec3 diffuseColor = color * diffuseIntensity * coefficient.diffuse;

    float specularIntensity = 0.;
    if (flag.enableSpecular == 1 && NdotL > 0.) {
        // lighting calculations happen in view space
        vec3 viewPosition = vec3(viewer.view * vec4(position, 1.));
        vec3 V = normalize(-viewPosition);  // eye/camera/view vector

        specularIntensity = flag.enableCookTorrance == 1 ?
            computeCookTorranceSpecularIntensity(V, L, N, NdotL) : computePhongSpecularIntensity(V, L, N);
    }
    vec3 specularColor = specularIntensity * coefficient.specular;  // white light

    float spotlightIntensity = flag.enableSpotlight == 1 ? computeSpotlightIntensity(L) : 1.;
    float shadowIntensity = flag.enableShadow == 1 ? computeShadowIntensity(position, L) : 1.;

    return ambientColor + (diffuseColor + specularColor) * spotlightIntensity * shadowIntensity;
}

void main() {
    vec4 position = transformationMatrix * vec4(vertexPosition, 1.);

    gl_Position = viewer.projection * viewer.view * position;

    fragmentColor = computeFinalColor(position.xyz, vertexColor, normalMatrix * vertexNormal);
}`;