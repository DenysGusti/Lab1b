import * as glm from '../gl-matrix/index.js';
import {GlobalTransformationObject} from "../transformation_object/global_transformation_object.js";

export class Viewer extends GlobalTransformationObject {
    fixedTarget = null;
    fixedDirection = null;
    up;

    projectionMatrix;
    selectableObject;

    constructor(position, fixedTarget, fixedDirection, up, projectionMatrix, selectableObject) {
        super();
        super.translate(position);

        this.fixedTarget = fixedTarget;
        this.fixedDirection = fixedDirection;
        this.up = up;

        this.projectionMatrix = projectionMatrix;
        this.selectableObject = selectableObject;
    }

    getPosition() {
        const position = glm.vec4.fromValues(0, 0, 0, 1);
        glm.vec4.transformMat4(position, position, super.getTransformationMatrix());
        return glm.vec3.fromValues(position[0], position[1], position[2]);
    }

    getDirection() {
        if (this.fixedDirection != null) {
            return this.fixedDirection;
        } else if (this.fixedTarget != null) {
            const direction = glm.vec3.create();
            glm.vec3.sub(direction, this.fixedTarget, this.getPosition());
            return direction;
        }
    }

    getViewMatrix() {
        const viewMatrix = glm.mat4.create();

        if (this.fixedTarget != null) {
            glm.mat4.lookAt(viewMatrix, this.getPosition(), this.fixedTarget, this.up);
        } else if (this.fixedDirection != null) {
            const position = this.getPosition();
            const target = glm.vec3.create();
            glm.vec3.add(target, position, this.fixedDirection);
            glm.mat4.lookAt(viewMatrix, position, target, this.up);
        }

        return viewMatrix;
    }
}