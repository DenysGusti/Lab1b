import * as glm from '../gl-matrix/index.js';

export class Program {
    gl;
    program;

    positionAttrib;
    colorAttrib;
    normalAttrib;

    coefficientAmbientUniform;
    coefficientDiffuseUniform;
    coefficientSpecularUniform;
    coefficientShininessUniform;
    coefficientF0Uniform;
    coefficientRoughnessUniform;

    cameraPositionUniform;
    cameraProjectionUniform;
    cameraViewUniform;

    lightPositionUniform;
    lightProjectionUniform;
    lightViewUniform;

    transformationUniform;

    normalUniform;

    constructor(gl, vertexShaderSourceCode, fragmentShaderSourceCode) {
        this.gl = gl;
        this.createProgram(vertexShaderSourceCode, fragmentShaderSourceCode);
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        // Check if the shader compiled successfully
        if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            return shader;
        }

        console.log(source, this.gl.getShaderInfoLog(shader));
    }

    createProgram(vertexShaderSourceCode, fragmentShaderSourceCode) {
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSourceCode);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSourceCode);

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

            this.coefficientAmbientUniform = this.gl.getUniformLocation(this.program, 'coefficient.ambient');
            this.coefficientDiffuseUniform = this.gl.getUniformLocation(this.program, 'coefficient.diffuse');
            this.coefficientSpecularUniform = this.gl.getUniformLocation(this.program, 'coefficient.specular');
            this.coefficientShininessUniform = this.gl.getUniformLocation(this.program, 'coefficient.shininess');
            this.coefficientF0Uniform = this.gl.getUniformLocation(this.program, 'coefficient.F0');
            this.coefficientRoughnessUniform = this.gl.getUniformLocation(this.program, 'coefficient.roughness');

            this.cameraPositionUniform = this.gl.getUniformLocation(this.program, 'camera.position');
            this.cameraProjectionUniform = this.gl.getUniformLocation(this.program, 'camera.projection');
            this.cameraViewUniform = this.gl.getUniformLocation(this.program, 'camera.view');

            this.lightPositionUniform = this.gl.getUniformLocation(this.program, 'light.position');
            this.lightProjectionUniform = this.gl.getUniformLocation(this.program, 'light.projection');
            this.lightViewUniform = this.gl.getUniformLocation(this.program, 'light.view');

            this.transformationUniform = this.gl.getUniformLocation(this.program, 'transformation');
            this.normalUniform = this.gl.getUniformLocation(this.program, 'normal');
        }
    }

    activate() {
        this.gl.useProgram(this.program);
        return this;
    }

    setUniformStructs(coefficient, camera, light) {
        this.gl.uniform3fv(this.coefficientAmbientUniform, coefficient.ambient);
        this.gl.uniform3fv(this.coefficientDiffuseUniform, coefficient.diffuse);
        this.gl.uniform3fv(this.coefficientSpecularUniform, coefficient.specular);
        this.gl.uniform1f(this.coefficientShininessUniform, coefficient.shininess);
        this.gl.uniform1f(this.coefficientF0Uniform, coefficient.F0);
        this.gl.uniform1f(this.coefficientRoughnessUniform, coefficient.roughness);

        this.gl.uniform3fv(this.cameraPositionUniform, camera.getPosition());
        this.gl.uniformMatrix4fv(this.cameraProjectionUniform, false, camera.projectionMatrix);
        this.gl.uniformMatrix4fv(this.cameraViewUniform, false, camera.getViewMatrix());

        this.gl.uniform3fv(this.lightPositionUniform, light.getPosition());
        this.gl.uniformMatrix4fv(this.lightProjectionUniform, false, light.projectionMatrix);
        this.gl.uniformMatrix4fv(this.lightViewUniform, false, light.getViewMatrix());
    }

    setUniformTransformation(transformation, camera) {
        this.gl.uniformMatrix4fv(this.transformationUniform, false, transformation);

        // normalMatrix = inverseTranspose(mat3(camera.view * transformation))
        const cameraViewTransformation = glm.mat4.create();
        glm.mat4.multiply(cameraViewTransformation, camera.getViewMatrix(), transformation);

        const normalMatrix = glm.mat3.create();
        glm.mat3.normalFromMat4(normalMatrix, cameraViewTransformation);

        this.gl.uniformMatrix3fv(this.normalUniform, false, normalMatrix);
    }
}