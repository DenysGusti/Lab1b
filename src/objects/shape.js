import {LocalTransformationObject} from "../transformation_object/local_transformation_object.js";

export class Shape extends LocalTransformationObject {
    vao;
    selectableObject;

    constructor(vao, selectableObject) {
        super();

        this.vao = vao;
        this.selectableObject = selectableObject;
    }
}
