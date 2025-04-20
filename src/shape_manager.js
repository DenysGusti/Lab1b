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
import {
    createInterleavedTile,
    TILE_VERTICES,
    TILE_COLORS,
    TILE_INDICES,
    TILE_NORMALS
} from "./geometry/tile.js";

import {Shape} from "./objects/shape.js";
import {OBJParser} from "./obj_parser.js";
import {Vao} from "./objects/vao.js";
import {SelectableObject} from "./objects/selectable_object.js";
import {BoundingBoxManager} from "./objects/boundingBoxManager.js";

export class ShapeManager {
    gl;
    program;

    cubeVao;
    octahedronVao;
    coordinateSystemVao;
    tileVao;

    // loaded obj models
    objVao = {};

    constructor(gl, program) {
        this.gl = gl;
        this.program = program;

        this.initShapes();
    }

    initShapes() {
        this.initCube();
        this.initOctahedron();
        this.initCoordinateSystem();
        this.initTile();
    }

    initCube() {
        const interleavedCubeVertices = createInterleavedCube(CUBE_VERTICES, CUBE_COLORS, CUBE_NORMALS);
        const boundingBoxManager = new BoundingBoxManager(interleavedCubeVertices);
        this.cubeVao =
            new Vao(this.gl, this.program, this.gl.TRIANGLES, boundingBoxManager.transformedVertices, CUBE_INDICES);
    }

    initOctahedron() {
        const interleavedOctahedronVertices =
            createInterleavedOctahedron(OCTAHEDRON_VERTICES, OCTAHEDRON_COLORS, OCTAHEDRON_NORMALS);
        const boundingBoxManager = new BoundingBoxManager(interleavedOctahedronVertices);
        this.octahedronVao =
            new Vao(this.gl, this.program, this.gl.TRIANGLES, boundingBoxManager.transformedVertices, OCTAHEDRON_INDICES);
    }

    initCoordinateSystem() {
        const interleavedCoordinateSystemVertices =
            createInterleavedCoordinateSystem(COORDINATE_SYSTEM_VERTICES, COORDINATE_SYSTEM_COLORS, COORDINATE_SYSTEM_NORMALS);
        this.coordinateSystemVao =
            new Vao(this.gl, this.program, this.gl.LINES, interleavedCoordinateSystemVertices, COORDINATE_SYSTEM_INDICES);
    }

    initTile() {
        const interleavedTileVertices =
            createInterleavedTile(TILE_VERTICES, TILE_COLORS, TILE_NORMALS);
        this.tileVao = new Vao(this.gl, this.program, this.gl.TRIANGLES, interleavedTileVertices, TILE_INDICES);
    }

    createCube(translateVec) {
        const shape = new Shape(this.cubeVao, this.createSelectableObject());
        shape.translate(translateVec);
        return shape;
    }

    createOctahedron(translateVec) {
        const shape = new Shape(this.octahedronVao, this.createSelectableObject());
        shape.translate(translateVec);
        return shape;
    }

    createSelectableObject() {
        return new SelectableObject(this.coordinateSystemVao);
    }

    createTile(translateVec) {
        const shape = new Shape(this.tileVao, this.createSelectableObject());
        shape.translate(translateVec);
        return shape;
    }

    addOBJ(name, objText) {
        const objParser = new OBJParser(objText);
        const boundingBoxManager = new BoundingBoxManager(objParser.getVertexData());
        this.objVao[name] =
            new Vao(this.gl, this.program, this.gl.TRIANGLES, boundingBoxManager.transformedVertices, objParser.getIndexData());
    }

    async addOBJFromFile(name, path) {
        const objText = await fetch(path).then(r => r.text());
        this.addOBJ(name, objText);
    }

    createOBJShape(name, translateVec) {
        const shape = new Shape(this.objVao[name], this.createSelectableObject());
        shape.translate(translateVec);
        return shape;
    }
}