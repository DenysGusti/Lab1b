import * as glm from '../gl-matrix';
import {TransformationObject} from "./transformation_object.js";

export class Shape extends TransformationObject {
    vao;
    numIndices;

    coordinateSystemVao;
    coordinateSystemNumIndices;

    selected = false;

    constructor(vao, numIndices, coordinateSystemVao, coordinateSystemNumIndices) {
        super();
        this.vao = vao;
        this.numIndices = numIndices;
        this.coordinateSystemVao = coordinateSystemVao;
        this.coordinateSystemNumIndices = coordinateSystemNumIndices;
    }

    draw(gl, program) {
        const modelMatrix = super.getTransformationMatrix();
        // const normalMatrix = glm.mat3.create();
        // glm.mat3.normalFromMat4(normalMatrix, modelViewMatrix);

        gl.uniformMatrix4fv(program.modelTransformationUniform, false, modelMatrix);

        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);

        // show coordinate axes
        if (this.selected) {
            gl.bindVertexArray(this.coordinateSystemVao);
            gl.drawElements(gl.LINES, this.coordinateSystemNumIndices, gl.UNSIGNED_SHORT, 0);
            gl.bindVertexArray(null);
        }
    }

    setNewVao(vao, numIndices) {
        this.vao = vao;
        this.numIndices = numIndices;
    }
}
