import {Program} from "./shaders/program.js";
import {ShapeManager} from "./shape_manager.js";
import {Camera} from "./camera.js";
import {InputHandler} from "./input_handler.js";
import {TransformationObject} from "./transformation_object.js";
import * as glm from './gl-matrix/index.js';

function printMat4(m) {
    for (let i = 0; i < 4; i++) {
        const row = [
            m[i],       // column 0
            m[i + 4],   // column 1
            m[i + 8],   // column 2
            m[i + 12]   // column 3
        ];
        console.log(row.map(n => n.toFixed(2)).join('\t'));
    }
}

async function main() {
    const canvas = document.getElementById("glCanvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        console.log("WebGL is not available in this browser");
        return;
    }

    const camera = new Camera(10);
    const globalTransform = new TransformationObject();

    const program = new Program(gl);
    const shapeManager = new ShapeManager(gl, program);

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

    new InputHandler(shapeManager, shapes, camera, globalTransform);

    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    gl.viewport(0, 0, canvas.width, canvas.height);

    const projectionMatrix = glm.mat4.create();
    glm.mat4.perspective(projectionMatrix, glm.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 100.0);

    gl.clearColor(0.08, 0.08, 0.08, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);

    const viewProjectionMatrix = glm.mat4.create();

    const drawFrame = () => {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        glm.mat4.multiply(viewProjectionMatrix, camera.getViewMatrix(), globalTransform.getTransformationMatrix());
        glm.mat4.multiply(viewProjectionMatrix, projectionMatrix, viewProjectionMatrix);
        // vertex shader gets already multiplied matrix: projectionMatrix * viewMatrix * globalTransformationMatrix
        program.setViewProjectionMatrix(viewProjectionMatrix);
        for (const shape of shapes) {
            shape.draw(gl, program);
        }
        window.requestAnimationFrame(drawFrame);
    };
    window.requestAnimationFrame(drawFrame);
}

main();
