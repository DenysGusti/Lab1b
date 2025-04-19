export class Coefficient {
    ambient;
    diffuse;
    specular;
    shininess;
    F0;
    roughness;

    constructor(ambient, diffuse, specular, shininess, F0, roughness) {
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
        this.F0 = F0;
        this.roughness = roughness;
    }
}