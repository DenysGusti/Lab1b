import {LocalTransformationObject} from "../transformation_object/local_transformation_object.js";
import {SelectableObject} from "./selectable_object.js";

export class Shape extends LocalTransformationObject {
    vao;
    selectableObject;

    constructor(vao, coordinateSystemVao) {
        super();

        this.vao = vao;
        this.selectableObject = new SelectableObject(coordinateSystemVao);
    }

    draw() {
        this.vao.draw();
    }
}
