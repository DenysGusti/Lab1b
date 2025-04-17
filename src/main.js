import * as glm from './gl-matrix';
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
        "phongDiffuse": new Program(gl, phongVertexShaderSourceCode, phongDiffuseFragmentShaderSourceCode)
    };

    // attributes are shares across programs, uniforms not
    // I think that base optimizes out normals, everything is dark, so gouraudSpecular
    const shapeManager = new ShapeManager(gl, programs["gouraudSpecular"].activate());

    await shapeManager.addOBJFromFile("bunny", "sampleModels/bunny.obj");
    await shapeManager.addOBJFromFile("cube", "sampleModels/cube.obj");
    await shapeManager.addOBJFromFile("teapot", "sampleModels/teapot.obj");
    await shapeManager.addOBJFromFile("tetrahedron", "sampleModels/tetrahedron.obj");

    const SPACING = 2.5;
    const shapes = [
        // shapeManager.createCube([-SPACING, SPACING, 0]),
        shapeManager.createOBJShape("bunny", [-SPACING, SPACING, 0], 10),

        // shapeManager.createOctahedron([0, SPACING, 0]),
        shapeManager.createOBJShape("cube", [0, SPACING, 0], 1),

        // shapeManager.createCube([SPACING, SPACING, 0]),
        shapeManager.createOBJShape("teapot", [SPACING, SPACING, 0], 1),

        // shapeManager.createOctahedron([-SPACING, 0, 0]),
        shapeManager.createOBJShape("tetrahedron", [-SPACING, 0, 0], 1),

        shapeManager.createCube([0, 0, 0]),
        shapeManager.createOctahedron([SPACING, 0, 0]),
        shapeManager.createCube([-SPACING, -SPACING, 0]),
        shapeManager.createOctahedron([0, -SPACING, 0]),
        shapeManager.createCube([SPACING, -SPACING, 0]),
    ];

    const camera = new Viewer([0, 0, 10], null, [0, 0, -1], 45, canvas.width / canvas.height, shapeManager.createSelectableObject());
    const light = new Viewer([0, 10, 10], glm.vec3.create(), null, 45, 1., shapeManager.createSelectableObject());
    const global = new GlobalCoordinateSystem(shapeManager.createSelectableObject());
    const coefficient = new Coefficient([0.2, 0.2, 0.2], [0.8, 0.8, 0.8], [1, 1, 1], 120);

    const uniformStructs = [coefficient, camera, light];

    const inputHandler = new InputHandler(shapeManager, programs, shapes, global, camera, light);

    const drawFrame = () => {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for (const [, program] of Object.entries(programs)) {
            program.activate().setUniformStructs(...uniformStructs);
        }

        // draw global coordinate axes without lighting
        programs["base"].activate().setUniformTransformation(global.getTransformationMatrix(), camera);
        global.selectableObject.drawCoordinateSystem();

        // draw light coordinate axes without lighting
        programs["base"].activate().setUniformTransformation(light.getTransformationMatrix(), camera);
        light.selectableObject.drawCoordinateSystem();

        for (const shape of shapes) {
            const transformation = glm.mat4.create();
            glm.mat4.multiply(transformation, global.getTransformationMatrix(), shape.getTransformationMatrix());

            // draw shape's coordinate axes without lighting
            programs["base"].activate().setUniformTransformation(transformation, camera);
            shape.selectableObject.drawCoordinateSystem();

            // draw shape with lighting
            inputHandler.currentProgram.activate().setUniformTransformation(transformation, camera);
            shape.vao.draw();
        }
        window.requestAnimationFrame(drawFrame);
    };

    window.requestAnimationFrame(drawFrame);
}

main();
