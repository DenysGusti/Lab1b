export class Coefficient {
    ambient;
    diffuse;
    specular;
    shininess;

    constructor(ambient, diffuse, specular, shininess) {
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
    }
}