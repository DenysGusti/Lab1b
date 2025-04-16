import {baseVertexShaderSourceCode} from "./base/vertex.js";
import {baseFragmentShaderSourceCode} from "./base/fragment.js";

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
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, baseVertexShaderSourceCode);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, baseFragmentShaderSourceCode);
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

            this.gl.useProgram(this.program);
        }
    }

    setUniforms(camera, light, global) {
        this.gl.uniform3fv(this.cameraPositionUniform, camera.eye);
        this.gl.uniformMatrix4fv(this.cameraProjectionUniform, false, camera.projectionMatrix);
        this.gl.uniformMatrix4fv(this.cameraViewUniform, false, camera.getViewMatrix());

        this.gl.uniform3fv(this.lightPositionUniform, light.eye);
        this.gl.uniformMatrix4fv(this.lightProjectionUniform, false, light.projectionMatrix);
        this.gl.uniformMatrix4fv(this.lightViewUniform, false, light.getViewMatrix());

        this.gl.uniformMatrix4fv(this.globalTransformationUniform, false, global.getTransformationMatrix());
    }
}