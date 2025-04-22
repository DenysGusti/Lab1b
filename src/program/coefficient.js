export class Coefficient {
    ambient;
    diffuse;
    specular;
    shininess;
    F0;
    roughness;
    innerCutoff;
    outerCutoff;
    shadowClipNearFar;
    bias;

    constructor(ambient, diffuse, specular, shininess, F0, roughness, innerCutoff, outerCutoff, shadowClipNearFar, bias) {
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
        this.F0 = F0;
        this.roughness = roughness;
        this.innerCutoff = innerCutoff;
        this.outerCutoff = outerCutoff;
        this.shadowClipNearFar = shadowClipNearFar;
        this.bias = bias;
    }
}