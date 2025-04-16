import * as glm from '../gl-matrix';
import {printMat3} from "../utils.js";
import {baseVertexShaderSourceCode} from "./base/vertex.js";
import {baseFragmentShaderSourceCode} from "./base/fragment.js";
import {gourandVertexShaderSourceCode} from "./gourand/vertex.js";
import {gourandFragmentShaderSourceCode} from "./gourand/fragment.js";

export class Program {
    gl;
    program;

    positionAttrib;
    colorAttrib;
    normalAttrib;

    cameraPositionUniform;
    cameraProjectionUniform;
    cameraViewUniform;

    lightPositionUniform;
    lightProjectionUniform;
    lightViewUniform;

    globalTransformationUniform;
    modelTransformationUniform;

    normalUniform;

    coefficientAmbientUniform;
    coefficientDiffuseUniform;
    coefficientSpecularUniform;
    coefficientShininessUniform;

    constructor(gl) {
        this.gl = gl;
        this.createProgram();
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        // Check if the shader compiled successfully
        if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            return shader;
        }

        console.log(this.gl.getShaderInfoLog(shader));
    }

    createProgram() {
        // const vertexShader = this.createShader(this.gl.VERTEX_SHADER, baseVertexShaderSourceCode);
        // const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, baseFragmentShaderSourceCode);
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, gourandVertexShaderSourceCode);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, gourandFragmentShaderSourceCode);

        this.program = this.gl.createProgram();

        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        // Checks if the linking worked
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.log(this.gl.getProgramInfoLog(this.program));
        } else {
            this.positionAttrib = this.gl.getAttribLocation(this.program, 'vertexPosition');
            this.colorAttrib = this.gl.getAttribLocation(this.program, 'vertexColor');
            this.normalAttrib = this.gl.getAttribLocation(this.program, 'vertexNormal');

            this.cameraPositionUniform = this.gl.getUniformLocation(this.program, 'camera.position');
            this.cameraProjectionUniform = this.gl.getUniformLocation(this.program, 'camera.projection');
            this.cameraViewUniform = this.gl.getUniformLocation(this.program, 'camera.view');

            this.lightPositionUniform = this.gl.getUniformLocation(this.program, 'light.position');
            this.lightProjectionUniform = this.gl.getUniformLocation(this.program, 'light.projection');
            this.lightViewUniform = this.gl.getUniformLocation(this.program, 'light.view');

            this.globalTransformationUniform = this.gl.getUniformLocation(this.program, 'global.transformation');
            this.modelTransformationUniform = this.gl.getUniformLocation(this.program, 'model.transformation');

            this.normalUniform = this.gl.getUniformLocation(this.program, 'normal');

            this.coefficientAmbientUniform = this.gl.getUniformLocation(this.program, 'coefficient.ambient');
            this.coefficientDiffuseUniform = this.gl.getUniformLocation(this.program, 'coefficient.diffuse');
            this.coefficientSpecularUniform = this.gl.getUniformLocation(this.program, 'coefficient.specular');
            this.coefficientShininessUniform = this.gl.getUniformLocation(this.program, 'coefficient.shininess');

            this.gl.useProgram(this.program);
        }
    }

    setUniforms(camera, light, global, coefficient) {
        this.gl.uniform3fv(this.cameraPositionUniform, camera.eye);
        this.gl.uniformMatrix4fv(this.cameraProjectionUniform, false, camera.projectionMatrix);
        this.gl.uniformMatrix4fv(this.cameraViewUniform, false, camera.getViewMatrix());

        this.gl.uniform3fv(this.lightPositionUniform, light.eye);
        this.gl.uniformMatrix4fv(this.lightProjectionUniform, false, light.projectionMatrix);
        this.gl.uniformMatrix4fv(this.lightViewUniform, false, light.getViewMatrix());

        this.gl.uniformMatrix4fv(this.globalTransformationUniform, false, global.getTransformationMatrix());

        this.gl.uniform3fv(this.coefficientAmbientUniform, coefficient.ambient);
        this.gl.uniform3fv(this.coefficientDiffuseUniform, coefficient.diffuse);
        this.gl.uniform3fv(this.coefficientSpecularUniform, coefficient.specular);
        this.gl.uniform1f(this.coefficientShininessUniform, coefficient.shininess);
    }

    setModelUniforms(model, camera, global) {
        const modelTransformation = model.getTransformationMatrix();
        this.gl.uniformMatrix4fv(this.modelTransformationUniform, false, modelTransformation);

        const cameraViewGlobalTransformationModelTransformation = glm.mat4.create();
        glm.mat4.multiply(cameraViewGlobalTransformationModelTransformation,
            global.getTransformationMatrix(), model.getTransformationMatrix());
        glm.mat4.multiply(cameraViewGlobalTransformationModelTransformation,
            camera.getViewMatrix(), cameraViewGlobalTransformationModelTransformation);

        // inverseTranspose(mat3(camera.view * global.transformation * model.transformation))
        const normalMatrix = glm.mat3.create();
        glm.mat3.normalFromMat4(normalMatrix, cameraViewGlobalTransformationModelTransformation);
        this.gl.uniformMatrix3fv(this.normalUniform, false, normalMatrix);
    }
}