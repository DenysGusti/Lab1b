import {LocalTransformationObject} from "../transformation_object/local_transformation_object.js";

export class Shape extends LocalTransformationObject {
    vao;
    coordinateSystemVao;

    selected = false;

    constructor(vao, coordinateSystemVao) {
        super();

        this.vao = vao;
        this.coordinateSystemVao = coordinateSystemVao;
    }

    draw() {
        this.vao.draw();

        // show coordinate axes
        if (this.selected) {
            this.coordinateSystemVao.draw();
        }
    }
}
