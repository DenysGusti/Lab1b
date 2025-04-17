import * as glm from '../gl-matrix';
import {GlobalTransformationObject} from "../transformation_object/global_transformation_object.js";

export class Viewer extends GlobalTransformationObject {
    eye;
    projectionMatrix = glm.mat4.create();
    defaultViewMatrix = glm.mat4.create();
    selectableObject;

    constructor(eye, direction, fovy_degrees, aspect, selectableObject) {
        super();

        glm.mat4.perspective(this.projectionMatrix, glm.glMatrix.toRadian(fovy_degrees), aspect, 0.1, 100.0);

        this.eye = [eye];
        const target = glm.vec3.create();
        glm.vec3.add(target, eye, direction);

        glm.mat4.lookAt(this.defaultViewMatrix, eye, target, [0, 1, 0]);

        // super.translate(eye);
        this.selectableObject = selectableObject;
    }

    getViewMatrix() {
        const viewMatrix = glm.mat4.create();
        glm.mat4.multiply(viewMatrix, super.getTransformationMatrix(), this.defaultViewMatrix);
        return viewMatrix;
    }
}