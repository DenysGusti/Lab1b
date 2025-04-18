import * as glm from '../gl-matrix/index.js';
import {GlobalTransformationObject} from "../transformation_object/global_transformation_object.js";

export class Viewer extends GlobalTransformationObject {
    fixedTarget = null;
    fixedDirection = null;

    projectionMatrix = glm.mat4.create();
    selectableObject;

    constructor(position, fixedTarget, fixedDirection, fovy_degrees, aspect, selectableObject) {
        super();
        super.translate(position);

        this.fixedTarget = fixedTarget;
        this.fixedDirection = fixedDirection;

        this.selectableObject = selectableObject;

        glm.mat4.perspective(this.projectionMatrix, glm.glMatrix.toRadian(fovy_degrees), aspect, 0.1, 100.0);
    }

    getPosition() {
        const position = glm.vec4.fromValues(0, 0, 0, 1);
        glm.vec4.transformMat4(position, position, super.getTransformationMatrix());
        return glm.vec3.fromValues(position[0], position[1], position[2]);
    }

    getViewMatrix() {
        const viewMatrix = glm.mat4.create();

        if (this.fixedTarget != null) {
            glm.mat4.lookAt(viewMatrix, this.getPosition(), this.fixedTarget, [0, 1, 0]);
        } else if (this.fixedDirection != null) {
            const position = this.getPosition();
            const target = glm.vec3.create();
            glm.vec3.add(target, position, this.fixedDirection);
            glm.mat4.lookAt(viewMatrix, position, target, [0, 1, 0]);
        }

        return viewMatrix;
    }
}