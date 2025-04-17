import * as glm from '../gl-matrix';
import {TransformationObject} from "./transformation_object.js";

export class LocalTransformationObject extends TransformationObject {
    scalingMatrix = glm.mat4.create();
    rotationTranslationMatrix = glm.mat4.create();

    scale(scaleVec) {
        glm.mat4.scale(this.scalingMatrix, this.scalingMatrix, scaleVec);
    }

    rotateX(angle) {
        glm.mat4.rotateX(this.rotationTranslationMatrix, this.rotationTranslationMatrix, angle);
    }

    rotateY(angle) {
        glm.mat4.rotateY(this.rotationTranslationMatrix, this.rotationTranslationMatrix, angle);
    }

    rotateZ(angle) {
        glm.mat4.rotateZ(this.rotationTranslationMatrix, this.rotationTranslationMatrix, angle);
    }

    translate(translateVec) {
        glm.mat4.translate(this.rotationTranslationMatrix, this.rotationTranslationMatrix, translateVec);
    }

    getTransformationMatrix() {
        const modelMatrix = glm.mat4.create();
        glm.mat4.multiply(modelMatrix, this.rotationTranslationMatrix, this.scalingMatrix);
        return modelMatrix;
    }
}