import * as glm from '../gl-matrix';
import {TransformationObject} from "./transformation_object.js";

export class Viewer extends TransformationObject {
    defaultViewMatrix = glm.mat4.create();

    constructor(eye, direction) {
        super();

        const target = glm.vec3.create();
        glm.vec3.add(target, eye, direction);

        glm.mat4.lookAt(this.defaultViewMatrix, eye, target, [0, 1, 0]);
    }

    getViewMatrix() {
        let viewMatrix = glm.mat4.create();
        glm.mat4.multiply(viewMatrix, super.getTransformationMatrix(), this.defaultViewMatrix);
        return viewMatrix;
    }
}