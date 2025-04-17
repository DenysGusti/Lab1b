import * as glm from '../gl-matrix';
import {TransformationObject} from "./transformation_object.js";

export class GlobalTransformationObject extends TransformationObject {
    scalingMatrix = glm.mat4.create();
    rotationMatrix = glm.mat4.create();
    translationMatrix = glm.mat4.create();

    scale(scaleVec) {
        glm.mat4.scale(this.scalingMatrix, this.scalingMatrix, scaleVec);
    }

    rotateX(angle) {
        glm.mat4.rotateX(this.rotationMatrix, this.rotationMatrix, angle);
    }

    rotateY(angle) {
        glm.mat4.rotateY(this.rotationMatrix, this.rotationMatrix, angle);
    }

    rotateZ(angle) {
        glm.mat4.rotateZ(this.rotationMatrix, this.rotationMatrix, angle);
    }

    translate(translateVec) {
        glm.mat4.translate(this.translationMatrix, this.translationMatrix, translateVec);
    }

    getTransformationMatrix() {
        const modelMatrix = glm.mat4.create();
        glm.mat4.multiply(modelMatrix, this.rotationMatrix, this.scalingMatrix);
        glm.mat4.multiply(modelMatrix, this.translationMatrix, modelMatrix);
        return modelMatrix;
    }
}