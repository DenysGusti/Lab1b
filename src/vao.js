export class Vao {
    gl;
    program;

    mode;

    vao;
    numIndices;

    constructor(gl, program, mode, interleavedVertices, indices) {
        this.gl = gl;
        this.program = program;
        this.mode = mode;
        this.numIndices = indices.length;

        const verticesBuffer = this.createVertexBuffer(interleavedVertices);
        const indicesBuffer = this.createIndexBuffer(indices);
        this.createInterleavedVao(verticesBuffer, indicesBuffer);
    }

    createBuffer(bufferType, data) {
        const buffer = this.gl.createBuffer();

        this.gl.bindBuffer(bufferType, buffer);
        this.gl.bufferData(bufferType, data, this.gl.STATIC_DRAW);
        this.gl.bindBuffer(bufferType, null);

        return buffer;
    }

    createVertexBuffer(vertexData) {
        return this.createBuffer(this.gl.ARRAY_BUFFER, vertexData);
    }

    createIndexBuffer(vertexData) {
        return this.createBuffer(this.gl.ELEMENT_ARRAY_BUFFER, vertexData);
    }

    // idea taken from https://youtu.be/watch?v=_GSCxcmJ06A
    createInterleavedVao(vertexBuffer, indexBuffer) {
        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);

        this.gl.enableVertexAttribArray(this.program.positionAttrib);
        this.gl.enableVertexAttribArray(this.program.colorAttrib);
        this.gl.enableVertexAttribArray(this.program.normalAttrib);

        // interleaved format: (x, y, z, r, g, b, nx, ny, nz) (all f32)
        const vertexBytes = 9 * Float32Array.BYTES_PER_ELEMENT;
        const offset = 3 * Float32Array.BYTES_PER_ELEMENT;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.vertexAttribPointer(this.program.positionAttrib, 3, this.gl.FLOAT, false, vertexBytes, 0);
        this.gl.vertexAttribPointer(this.program.colorAttrib, 3, this.gl.FLOAT, false, vertexBytes, offset);
        this.gl.vertexAttribPointer(this.program.normalAttrib, 3, this.gl.FLOAT, false, vertexBytes, 2 * offset);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);


        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.gl.bindVertexArray(null);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    draw() {
        this.gl.bindVertexArray(this.vao);
        this.gl.drawElements(this.mode, this.numIndices, this.gl.UNSIGNED_SHORT, 0);
        this.gl.bindVertexArray(null);
    }
}