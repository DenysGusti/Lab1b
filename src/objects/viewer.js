import * as glm from '../gl-matrix';
import {TransformationObject} from "./transformation_object.js";

export class Viewer extends TransformationObject {
    eye;
    projectionMatrix = glm.mat4.create();
    defaultViewMatrix = glm.mat4.create();

    constructor(eye, direction, fovy_degrees, aspect) {
        super();

        glm.mat4.perspective(this.projectionMatrix, glm.glMatrix.toRadian(fovy_degrees), aspect, 0.1, 100.0);

        this.eye = eye;
        const target = glm.vec3.create();
        glm.vec3.add(target, eye, direction);

        glm.mat4.lookAt(this.defaultViewMatrix, eye, target, [0, 1, 0]);
    }

    getViewMatrix() {
        const viewMatrix = glm.mat4.create();
        glm.mat4.multiply(viewMatrix, super.getTransformationMatrix(), this.defaultViewMatrix);
        return viewMatrix;
    }
}