import * as glm from './gl-matrix/index.js';

import {Program} from "./program/program.js";
import {ShapeManager} from "./shape_manager.js";
import {InputHandler} from "./input_handler.js";
import {Viewer} from "./objects/viewer.js";
import {Coefficient} from "./program/coefficient.js";
import {GlobalCoordinateSystem} from "./objects/global_coordinate_system.js";

import {baseVertexShaderSourceCode} from "./shaders/base/vertex.js";
import {baseFragmentShaderSourceCode} from "./shaders/base/fragment.js";

import {shadowVertexShaderSourceCode} from "./shaders/shadow/vertex.js";
import {shadowFragmentShaderSourceCode} from "./shaders/shadow/fragment.js";

import {gouraudVertexShaderSourceCode} from "./shaders/gouraud/vertex.js";
import {gouraudFragmentShaderSourceCode} from "./shaders/gouraud/fragment.js";

import {phongVertexShaderSourceCode} from "./shaders/phong/vertex.js";
import {phongFragmentShaderSourceCode} from "./shaders/phong/fragment.js";

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

    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);

    const programs = {
        "base": new Program(gl, baseVertexShaderSourceCode, baseFragmentShaderSourceCode),
        "shadow": new Program(gl, shadowVertexShaderSourceCode, shadowFragmentShaderSourceCode),
        "gouraud": new Program(gl, gouraudVertexShaderSourceCode, gouraudFragmentShaderSourceCode),
        "phong": new Program(gl, phongVertexShaderSourceCode, phongFragmentShaderSourceCode)
    };

    // attributes are shares across programs, uniforms not
    // I think that base optimizes out normals, everything is dark, so phong
    const shapeManager = new ShapeManager(gl, programs["phong"].activate());

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

    const coefficient = new Coefficient(
        [0.3, 0.3, 0.3], [0.7, 0.7, 0.7], [1, 1, 1], 120,
        0.3, 0.2,
        Math.cos(glm.glMatrix.toRadian(5)), Math.cos(glm.glMatrix.toRadian(15)),
        [0.1, 100], 0.005);

    const cameraProjectionMatrix = glm.mat4.create();
    const lightProjectionMatrix = glm.mat4.create();
    glm.mat4.perspective(cameraProjectionMatrix, glm.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 100.);
    glm.mat4.perspective(lightProjectionMatrix, glm.glMatrix.toRadian(90), 1, ...coefficient.shadowClipNearFar);

    const camera = new Viewer([0, 0, 10], null, [0, 0, -1], [0, 1, 0], cameraProjectionMatrix, shapeManager.createSelectableObject());
    const light = new Viewer([0, 10, 0], glm.vec3.create(), null, [0, 1, 0], lightProjectionMatrix, shapeManager.createSelectableObject());

    const global = new GlobalCoordinateSystem(shapeManager.createSelectableObject());

    const inputHandler = new InputHandler(shapeManager, programs, shapes, global, camera, light);

    const shadowMapCube = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowMapCube);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

    const textureSize = 4096;
    for (let i = 0; i < 6; i++) {
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
            0, gl.RGBA, textureSize, textureSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }

    const shadowMapFramebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowMapFramebuffer);

    const shadowMapRenderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, shadowMapRenderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, textureSize, textureSize);

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    const generateShadowMap = () => {
        const lightPosition = light.getPosition();

        const shadowMapCameras = [
            // Positive X
            new Viewer(lightPosition, null, [1, 0, 0], [0, -1, 0], null, null),
            // Negative X
            new Viewer(lightPosition, null, [-1, 0, 0], [0, -1, 0], null, null),
            // Positive Y
            new Viewer(lightPosition, null, [0, 1, 0], [0, 0, 1], null, null),
            // Negative Y
            new Viewer(lightPosition, null, [0, -1, 0], [0, 0, -1], null, null),
            // Positive Z
            new Viewer(lightPosition, null, [0, 0, 1], [0, -1, 0], null, null),
            // Negative Z
            new Viewer(lightPosition, null, [0, 0, -1], [0, -1, 0], null, null),
        ];

        programs["shadow"].activate();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowMapCube);
        gl.bindFramebuffer(gl.FRAMEBUFFER, shadowMapFramebuffer);
        gl.bindRenderbuffer(gl.RENDERBUFFER, shadowMapRenderbuffer);
        gl.viewport(0, 0, textureSize, textureSize);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        for (let i = 0; i < shadowMapCameras.length; i++) {
            programs["shadow"].activate().setViewerUniform(light.projectionMatrix, shadowMapCameras[i].getViewMatrix());

            // Set framebuffer destination
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, shadowMapCube, 0);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, shadowMapRenderbuffer);

            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            for (const shape of shapes) {
                const transformation = glm.mat4.create();
                glm.mat4.multiply(transformation, global.getTransformationMatrix(), shape.getTransformationMatrix());

                programs["shadow"].activate().setTransformationUniform(transformation);
                shape.vao.draw();
            }

            for (const tile of groundPlane) {
                const transformation = glm.mat4.create();
                glm.mat4.multiply(transformation, global.getTransformationMatrix(), tile.getTransformationMatrix());

                programs["shadow"].activate().setTransformationUniform(transformation);
                tile.vao.draw();
            }
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    };

    const render = () => {
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, shadowMapCube);

        for (const [, program] of Object.entries(programs)) {
            program.activate().setViewerUniform(camera.projectionMatrix, camera.getViewMatrix());
        }

        // draw global coordinate axes without lighting
        programs["base"].activate().setTransformationUniform(global.getTransformationMatrix());
        global.selectableObject.drawCoordinateSystem();

        // draw light coordinate axes without lighting
        programs["base"].activate().setTransformationUniform(light.getTransformationMatrix());
        light.selectableObject.drawCoordinateSystem();

        gl.enable(gl.CULL_FACE);
        for (const shape of shapes) {
            const transformation = glm.mat4.create();
            glm.mat4.multiply(transformation, global.getTransformationMatrix(), shape.getTransformationMatrix());

            // draw shape's coordinate axes without lighting
            if (shape.selectableObject.selected) {
                programs["base"].activate().setTransformationUniform(transformation);
                shape.selectableObject.drawCoordinateSystem();
            }

            // draw shape with lighting
            inputHandler.currentProgram.activate().setTransformationUniform(transformation);
            shape.vao.draw();
        }

        gl.disable(gl.CULL_FACE);
        for (const tile of groundPlane) {
            const transformation = glm.mat4.create();
            glm.mat4.multiply(transformation, global.getTransformationMatrix(), tile.getTransformationMatrix());

            // draw tile with lighting
            inputHandler.currentProgram.activate().setTransformationUniform(transformation);
            tile.vao.draw();
        }
    };

    for (const [, program] of Object.entries(programs)) {
        program.activate().setCoefficientUniform(coefficient);
    }

    const drawFrame = () => {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for (const [, program] of Object.entries(programs)) {
            program.activate().setFlagUniform(inputHandler.flag);
            program.setLightUniform(light.getPosition(), light.getDirection());
        }

        generateShadowMap();
        render();

        window.requestAnimationFrame(drawFrame);
    };

    window.requestAnimationFrame(drawFrame);
}

main();
