import {baseVertexShaderSourceCode} from "./base/vertex.js";
import {baseFragmentShaderSourceCode} from "./base/fragment.js";

export class Program {
    gl;
    program;

    positionAttrib;
    colorAttrib;
    normalAttrib;

    modelMatrixUniform;
    viewProjectionMatrixUniform;

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

            this.modelMatrixUniform = this.gl.getUniformLocation(this.program, 'modelMatrix');
            this.viewProjectionMatrixUniform = this.gl.getUniformLocation(this.program, 'viewProjectionMatrix');

            this.gl.useProgram(this.program);
        }
    }

    setViewProjectionMatrix(viewProjectionMatrix) {
        this.gl.uniformMatrix4fv(this.viewProjectionMatrixUniform, false, viewProjectionMatrix);
    }
}