import * as glm from './gl-matrix/index.js';

import {Program} from "./shaders/program.js";
import {ShapeManager} from "./shape_manager.js";
import {InputHandler} from "./input_handler.js";
import {Viewer} from "./objects/viewer.js";
import {Coefficient} from "./coefficient.js";
import {GlobalCoordinateSystem} from "./objects/global_coordinate_system.js";

import {baseVertexShaderSourceCode} from "./shaders/base/vertex.js";
import {baseFragmentShaderSourceCode} from "./shaders/base/fragment.js";

import {gouraudDiffuseVertexShaderSourceCode} from "./shaders/gouraud/vertex_diffuse.js";
import {gouraudSpecularVertexShaderSourceCode} from "./shaders/gouraud/vertex_specular.js";
import {gouraudFragmentShaderSourceCode} from "./shaders/gouraud/fragment.js";

import {phongVertexShaderSourceCode} from "./shaders/phong/vertex.js";
import {phongDiffuseFragmentShaderSourceCode} from "./shaders/phong/fragment_diffuse.js";
import {phongSpecularFragmentShaderSourceCode} from "./shaders/phong/fragment_specular.js";
import {cookTorranceFragmentShaderSourceCode} from "./shaders/cook_torrance/fragment.js";

import {TILE_LIMIT} from "./geometry/tile.js";

async function main() {
    const canvas = document.getElementById("glCanvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        console.log("WebGL is not available in this browser");
        return;
    }

    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.08, 0.08, 0.08, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);

    const programs = {
        "base": new Program(gl, baseVertexShaderSourceCode, baseFragmentShaderSourceCode),
        "gouraudDiffuse": new Program(gl, gouraudDiffuseVertexShaderSourceCode, gouraudFragmentShaderSourceCode),
        "gouraudSpecular": new Program(gl, gouraudSpecularVertexShaderSourceCode, gouraudFragmentShaderSourceCode),
        "phongDiffuse": new Program(gl, phongVertexShaderSourceCode, phongDiffuseFragmentShaderSourceCode),
        "phongSpecular": new Program(gl, phongVertexShaderSourceCode, phongSpecularFragmentShaderSourceCode),
        "cookTorrance": new Program(gl, phongVertexShaderSourceCode, cookTorranceFragmentShaderSourceCode)
    };

    // attributes are shares across programs, uniforms not
    // I think that base optimizes out normals, everything is dark, so gouraudSpecular
    const shapeManager = new ShapeManager(gl, programs["gouraudSpecular"].activate());

    await shapeManager.addOBJFromFile("bunny", "sampleModels/provided/bunny.obj");
    await shapeManager.addOBJFromFile("cube", "sampleModels/provided/cube.obj");
    await shapeManager.addOBJFromFile("teapot", "sampleModels/provided/teapot.obj");
    await shapeManager.addOBJFromFile("tetrahedron", "sampleModels/provided/tetrahedron.obj");

    await shapeManager.addOBJFromFile("cow", "sampleModels/blender/cow.obj");
    await shapeManager.addOBJFromFile("sphere", "sampleModels/blender/sphere.obj");
    await shapeManager.addOBJFromFile("suzanne", "sampleModels/blender/suzanne.obj");
    await shapeManager.addOBJFromFile("teddy", "sampleModels/blender/teddy.obj");

    const SPACING = 2.5;
    const shapes = [
        // shapeManager.createCube([-SPACING, SPACING, 0]),
        shapeManager.createOBJShape("bunny", [-SPACING, SPACING, 0]),

        // shapeManager.createOctahedron([0, SPACING, 0]),
        // shapeManager.createOBJShape("cube", [0, SPACING, 0]),
        shapeManager.createOBJShape("sphere", [0, SPACING, 0]),

        // shapeManager.createCube([SPACING, SPACING, 0]),
        shapeManager.createOBJShape("teapot", [SPACING, SPACING, 0]),

        // shapeManager.createOctahedron([-SPACING, 0, 0]),
        // shapeManager.createOBJShape("tetrahedron", [-SPACING, 0, 0]),
        shapeManager.createOBJShape("suzanne", [-SPACING, 0, 0]),

        // shapeManager.createCube([0, 0, 0]),
        shapeManager.createOBJShape("cow", [0, 0, 0]),

        // shapeManager.createOctahedron([SPACING, 0, 0]),
        shapeManager.createOBJShape("teddy", [SPACING, 0, 0]),

        shapeManager.createCube([-SPACING, -SPACING, 0]),
        shapeManager.createOctahedron([0, -SPACING, 0]),
        shapeManager.createCube([SPACING, -SPACING, 0]),
    ];

    const groundPlane = [];
    const TILE_COUNT = 10;
    for (let i = 0; i < TILE_COUNT; i++) {
        for (let j = 0; j < TILE_COUNT; j++) {
            const x = (2 * i - TILE_COUNT + 1) * TILE_LIMIT;
            const z = (2 * j - TILE_COUNT + 1) * TILE_LIMIT;
            groundPlane.push(shapeManager.createTile([x, -2 * SPACING, z]));
        }
    }

    const camera = new Viewer([0, 0, 10], null, [0, 0, -1], 45, canvas.width / canvas.height, shapeManager.createSelectableObject());
    const light = new Viewer([0, 10, 0], glm.vec3.create(), null, 45, 1., shapeManager.createSelectableObject());
    const global = new GlobalCoordinateSystem(shapeManager.createSelectableObject());
    const coefficient = new Coefficient(
        [0.3, 0.3, 0.3], [0.7, 0.7, 0.7], [1, 1, 1], 120,
        0.3, 0.2,
        Math.cos(glm.glMatrix.toRadian(5)), Math.cos(glm.glMatrix.toRadian(15)));
    const uniformStructs = [coefficient, camera, light];

    const inputHandler = new InputHandler(shapeManager, programs, shapes, global, camera, light);

    const drawFrame = () => {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for (const [, program] of Object.entries(programs)) {
            program.activate().setUniformStructs(...uniformStructs);
            program.activate().setUniformLight(inputHandler.currentLightType);
        }

        // draw global coordinate axes without lighting
        programs["base"].activate().setUniformTransformation(global.getTransformationMatrix(), camera);
        global.selectableObject.drawCoordinateSystem();

        // draw light coordinate axes without lighting
        programs["base"].activate().setUniformTransformation(light.getTransformationMatrix(), camera);
        light.selectableObject.drawCoordinateSystem();

        gl.enable(gl.CULL_FACE);
        for (const shape of shapes) {
            const transformation = glm.mat4.create();
            glm.mat4.multiply(transformation, global.getTransformationMatrix(), shape.getTransformationMatrix());

            // draw shape's coordinate axes without lighting
            if (shape.selectableObject.selected) {
                programs["base"].activate().setUniformTransformation(transformation, camera);
                shape.selectableObject.drawCoordinateSystem();
            }

            // draw shape with lighting
            inputHandler.currentProgram.activate().setUniformTransformation(transformation, camera);
            shape.vao.draw();
        }

        gl.disable(gl.CULL_FACE);
        for (const tile of groundPlane) {
            const transformation = glm.mat4.create();
            glm.mat4.multiply(transformation, global.getTransformationMatrix(), tile.getTransformationMatrix());

            // draw tile with lighting
            inputHandler.currentProgram.activate().setUniformTransformation(transformation, camera);
            tile.vao.draw();
        }

        window.requestAnimationFrame(drawFrame);
    };

    window.requestAnimationFrame(drawFrame);
}

main();
