import * as glm from './gl-matrix';
import {Program} from "./shaders/program.js";
import {ShapeManager} from "./shape_manager.js";
import {InputHandler} from "./input_handler.js";
import {Viewer} from "./objects/viewer.js";
import {Coefficient} from "./coefficient.js";
import {GlobalTransformationObject} from "./transformation_object/global_transformation_object.js";
import {baseVertexShaderSourceCode} from "./shaders/base/vertex.js";
import {baseFragmentShaderSourceCode} from "./shaders/base/fragment.js";
import {gourandVertexShaderSourceCode} from "./shaders/gourand/vertex.js";
import {gourandFragmentShaderSourceCode} from "./shaders/gourand/fragment.js";

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

    const camera = new Viewer([0, 0, 10], [0, 0, -1], 45, canvas.width / canvas.height);
    const pointLightSource = new Viewer([0, 10, 0], [0, 1, 0], 45, 1.);
    const global = new GlobalTransformationObject();
    const coefficient = new Coefficient([0.1, 0.1, 0.1], [1, 1, 1], [1, 1, 1], 120);

    const programs = {
        "base": new Program(gl, baseVertexShaderSourceCode, baseFragmentShaderSourceCode),
        "gourand": new Program(gl, gourandVertexShaderSourceCode, gourandFragmentShaderSourceCode),

    };

    let currentProgram = programs["gourand"].activate();

    const shapeManager = new ShapeManager(gl, currentProgram);

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

    new InputHandler(shapeManager, shapes, camera, global);

    const projectionMatrix = glm.mat4.create();
    glm.mat4.perspective(projectionMatrix, glm.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 100.0);

    const drawFrame = () => {
        currentProgram = programs["gourand"].activate();

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        currentProgram.setUniforms(camera, pointLightSource, global, coefficient);

        for (const shape of shapes) {
            currentProgram.setModelUniforms(shape, camera, global);
            shape.draw();
        }
        window.requestAnimationFrame(drawFrame);
    };
    window.requestAnimationFrame(drawFrame);
}

main();
