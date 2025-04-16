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

        gl.uniformMatrix4fv(program.modelMatrixUniform, false, modelMatrix);

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
