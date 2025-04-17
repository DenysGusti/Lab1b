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
import {Shape} from "./objects/shape.js";
import {OBJParser} from "./obj_parser.js";
import {Vao} from "./objects/vao.js";
import {SelectableObject} from "./objects/selectable_object.js";

export class ShapeManager {
    gl;
    program;

    cubeVao;
    octahedronVao;
    coordinateSystemVao;

    // loaded obj models
    objVao = {};

    constructor(gl, program) {
        this.gl = gl;
        this.program = program;

        this.initShapes();
    }

    initShapes() {
        const interleavedCubeVertices = createInterleavedCube(CUBE_VERTICES, CUBE_COLORS, CUBE_NORMALS);
        this.cubeVao = new Vao(this.gl, this.program, this.gl.TRIANGLES, interleavedCubeVertices, CUBE_INDICES);

        const interleavedOctahedronVertices =
            createInterleavedOctahedron(OCTAHEDRON_VERTICES, OCTAHEDRON_COLORS, OCTAHEDRON_NORMALS);
        this.octahedronVao = new Vao(this.gl, this.program, this.gl.TRIANGLES, interleavedOctahedronVertices, OCTAHEDRON_INDICES);

        const interleavedCoordinateSystemVertices =
            createInterleavedCoordinateSystem(COORDINATE_SYSTEM_VERTICES, COORDINATE_SYSTEM_COLORS, COORDINATE_SYSTEM_NORMALS);
        this.coordinateSystemVao = new Vao(this.gl, this.program, this.gl.LINES, interleavedCoordinateSystemVertices, COORDINATE_SYSTEM_INDICES);
    }

    createCube(translateVec) {
        const shape = new Shape(this.cubeVao, this.createSelectableObject());

        const cubeSizeMultiplier = 0.5;
        shape.scale([cubeSizeMultiplier, cubeSizeMultiplier, cubeSizeMultiplier]);
        shape.translate(translateVec);

        return shape;
    }

    createOctahedron(translateVec) {
        const shape = new Shape(this.octahedronVao, this.createSelectableObject());

        const octahedronSizeMultiplier = 0.70710678118;
        shape.scale([octahedronSizeMultiplier, octahedronSizeMultiplier, octahedronSizeMultiplier]);
        shape.translate(translateVec);

        return shape;
    }

    createSelectableObject() {
        return new SelectableObject(this.coordinateSystemVao);
    }

    addOBJ(name, objText) {
        const objParser = new OBJParser(objText);
        this.objVao[name] =
            new Vao(this.gl, this.program, this.gl.TRIANGLES, objParser.getVertexData(), objParser.getIndexData());
    }

    async addOBJFromFile(name, path) {
        const objText = await fetch(path).then(r => r.text());
        this.addOBJ(name, objText);
    }

    createOBJShape(name, translateVec, scaleFactor) {
        const shape = new Shape(this.objVao[name], this.createSelectableObject());

        shape.scale([scaleFactor, scaleFactor, scaleFactor]);
        shape.translate(translateVec);

        return shape;
    }
}