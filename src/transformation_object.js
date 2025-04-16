import * as glm from './gl-matrix/index.js';

// parent class for all objects that will be transformed
export class TransformationObject {
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

    // R * T * S
    getTransformationMatrix() {
        const modelMatrix = glm.mat4.create();
        glm.mat4.multiply(modelMatrix, this.rotationTranslationMatrix, this.scalingMatrix);
        return modelMatrix;
    }
}