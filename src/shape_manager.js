import {createInterleavedCube, CUBE_VERTICES, CUBE_COLORS, CUBE_INDICES, CUBE_NORMALS} from "./geometry/cube.js";
import {
    createInterleavedOctahedron,
    OCTAHEDRON_VERTICES,
    OCTAHEDRON_COLORS,
    OCTAHEDRON_INDICES, OCTAHEDRON_NORMALS
} from "./geometry/octahedron.js";
import {
    COORDINATE_SYSTEM_COLORS, COORDINATE_SYSTEM_INDICES, COORDINATE_SYSTEM_NORMALS,
    COORDINATE_SYSTEM_VERTICES,
    createInterleavedCoordinateSystem
} from "./geometry/coordinate_system.js";
import {Shape} from "./shape.js";
import {OBJParser} from "./obj_parser.js";

export class ShapeManager {
    gl;
    program;

    cubeVao;
    cubeNumIndices;

    octahedronVao;
    octahedronNumIndices;

    coordinateSystemVao;
    coordinateSystemNumIndices;

    // loaded obj models
    objVao = {};
    objNumIndices = {};

    constructor(gl, program) {
        this.gl = gl;
        this.program = program;

        this.initShapes();
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
        const vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(vao);

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

        return vao;
    }

    // some default shapes
    initShapes() {
        this.initCube();
        this.initOctahedron();
        this.initCoordinateSystem();
    }

    initCube() {
        const interleavedCubeVertices = createInterleavedCube(CUBE_VERTICES, CUBE_COLORS, CUBE_NORMALS);
        const cubeVerticesBuffer = this.createVertexBuffer(interleavedCubeVertices);
        const cubeIndicesBuffer = this.createIndexBuffer(CUBE_INDICES);

        this.cubeVao = this.createInterleavedVao(cubeVerticesBuffer, cubeIndicesBuffer);
        this.cubeNumIndices = CUBE_INDICES.length;
    }

    initOctahedron() {
        const interleavedOctahedronVertices =
            createInterleavedOctahedron(OCTAHEDRON_VERTICES, OCTAHEDRON_COLORS, OCTAHEDRON_NORMALS);
        const octahedronVerticesBuffer = this.createVertexBuffer(interleavedOctahedronVertices);
        const octahedronIndicesBuffer = this.createIndexBuffer(OCTAHEDRON_INDICES);

        this.octahedronVao = this.createInterleavedVao(octahedronVerticesBuffer, octahedronIndicesBuffer);
        this.octahedronNumIndices = OCTAHEDRON_INDICES.length;
    }

    initCoordinateSystem() {
        const interleavedCoordinateSystemVertices =
            createInterleavedCoordinateSystem(COORDINATE_SYSTEM_VERTICES, COORDINATE_SYSTEM_COLORS, COORDINATE_SYSTEM_NORMALS);
        const coordinateSystemVerticesBuffer = this.createVertexBuffer(interleavedCoordinateSystemVertices);
        const coordinateSystemIndicesBuffer = this.createIndexBuffer(COORDINATE_SYSTEM_INDICES);

        this.coordinateSystemVao =
            this.createInterleavedVao(coordinateSystemVerticesBuffer, coordinateSystemIndicesBuffer);
        this.coordinateSystemNumIndices = COORDINATE_SYSTEM_INDICES.length;
    }

    createCube(translateVec) {
        const shape =
            new Shape(this.cubeVao, this.cubeNumIndices, this.coordinateSystemVao, this.coordinateSystemNumIndices);

        const cubeSizeMultiplier = 0.5;
        shape.scale([cubeSizeMultiplier, cubeSizeMultiplier, cubeSizeMultiplier]);
        shape.translate(translateVec);

        return shape;
    }

    createOctahedron(translateVec) {
        const shape =
            new Shape(this.octahedronVao, this.octahedronNumIndices, this.coordinateSystemVao, this.coordinateSystemNumIndices);

        const octahedronSizeMultiplier = 0.70710678118;
        shape.scale([octahedronSizeMultiplier, octahedronSizeMultiplier, octahedronSizeMultiplier]);
        shape.translate(translateVec);

        return shape;
    }

    addOBJ(name, objText) {
        const objParser = new OBJParser(objText);

        const objVertices = objParser.getVertexData();
        const objIndices = objParser.getIndexData();

        const objVerticesBuffer = this.createVertexBuffer(objVertices);
        const objIndicesBuffer = this.createIndexBuffer(objIndices);

        this.objVao[name] = this.createInterleavedVao(objVerticesBuffer, objIndicesBuffer);
        this.objNumIndices[name] = objIndices.length;
    }

    async addOBJFromFile(name, path) {
        const objText = await fetch(path).then(r => r.text());
        this.addOBJ(name, objText);
    }

    createOBJShape(name, translateVec, scaleFactor) {
        const shape =
            new Shape(this.objVao[name], this.objNumIndices[name], this.coordinateSystemVao, this.coordinateSystemNumIndices);

        shape.scale([scaleFactor, scaleFactor, scaleFactor]);
        shape.translate(translateVec);

        return shape;
    }
}