import * as glm from '../gl-matrix';
import {TransformationObject} from "./transformation_object.js";

export class GlobalTransformationObject extends TransformationObject {
    transformationMatrix = glm.mat4.create();

    scale(scaleVec) {
        const scalingMatrix = glm.mat4.create();
        glm.mat4.scale(scalingMatrix, scalingMatrix, scaleVec);
        glm.mat4.multiply(this.transformationMatrix, scalingMatrix, this.transformationMatrix);
    }

    rotateX(angle) {
        const rotationMatrix = glm.mat4.create();
        glm.mat4.rotateX(rotationMatrix, rotationMatrix, angle);
        glm.mat4.multiply(this.transformationMatrix, rotationMatrix, this.transformationMatrix);
    }

    rotateY(angle) {
        const rotationMatrix = glm.mat4.create();
        glm.mat4.rotateY(rotationMatrix, rotationMatrix, angle);
        glm.mat4.multiply(this.transformationMatrix, rotationMatrix, this.transformationMatrix);
    }

    rotateZ(angle) {
        const rotationMatrix = glm.mat4.create();
        glm.mat4.rotateZ(rotationMatrix, rotationMatrix, angle);
        glm.mat4.multiply(this.transformationMatrix, rotationMatrix, this.transformationMatrix);
    }

    translate(translateVec) {
        const translationMatrix = glm.mat4.create();
        glm.mat4.translate(translationMatrix, translationMatrix, translateVec);
        glm.mat4.multiply(this.transformationMatrix, translationMatrix, this.transformationMatrix);
    }

    getTransformationMatrix() {
        return this.transformationMatrix;
    }
}