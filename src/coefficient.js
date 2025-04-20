export class Coefficient {
    ambient;
    diffuse;
    specular;
    shininess;
    F0;
    roughness;
    innerCutoff;
    outerCutoff;

    constructor(ambient, diffuse, specular, shininess, F0, roughness, innerCutoff, outerCutoff) {
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
        this.F0 = F0;
        this.roughness = roughness;
        this.innerCutoff = innerCutoff;
        this.outerCutoff = outerCutoff;
    }
}