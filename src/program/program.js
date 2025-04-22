import * as glm from '../gl-matrix';

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
    coefficientInnerCutoffUniform;
    coefficientOuterCutoffUniform;
    coefficientShadowClipNearFarUniform;
    coefficientBiasUniform;

    flagEnableSpecular;
    flagEnableCookTorrance;
    flagEnableSpotlight;
    flagEnableShadow;

    lightPositionUniform;
    lightDirectionUniform;

    viewerProjectionUniform;
    viewerViewUniform;

    transformationMatrixUniform;
    normalMatrixUniform;

    lightShadowMapUniform;

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
            this.bindUniforms();
        }
    }

    bindUniforms() {
        this.positionAttrib = this.gl.getAttribLocation(this.program, 'vertexPosition');
        this.colorAttrib = this.gl.getAttribLocation(this.program, 'vertexColor');
        this.normalAttrib = this.gl.getAttribLocation(this.program, 'vertexNormal');

        this.coefficientAmbientUniform = this.gl.getUniformLocation(this.program, 'coefficient.ambient');
        this.coefficientDiffuseUniform = this.gl.getUniformLocation(this.program, 'coefficient.diffuse');
        this.coefficientSpecularUniform = this.gl.getUniformLocation(this.program, 'coefficient.specular');
        this.coefficientShininessUniform = this.gl.getUniformLocation(this.program, 'coefficient.shininess');
        this.coefficientF0Uniform = this.gl.getUniformLocation(this.program, 'coefficient.F0');
        this.coefficientRoughnessUniform = this.gl.getUniformLocation(this.program, 'coefficient.roughness');
        this.coefficientInnerCutoffUniform = this.gl.getUniformLocation(this.program, 'coefficient.innerCutoff');
        this.coefficientOuterCutoffUniform = this.gl.getUniformLocation(this.program, 'coefficient.outerCutoff');
        this.coefficientShadowClipNearFarUniform = this.gl.getUniformLocation(this.program, 'coefficient.shadowClipNearFar');
        this.coefficientBiasUniform = this.gl.getUniformLocation(this.program, 'coefficient.bias');

        this.flagEnableSpecular = this.gl.getUniformLocation(this.program, 'flag.enableSpecular');
        this.flagEnableCookTorrance = this.gl.getUniformLocation(this.program, 'flag.enableCookTorrance');
        this.flagEnableSpotlight = this.gl.getUniformLocation(this.program, 'flag.enableSpotlight');
        this.flagEnableShadow = this.gl.getUniformLocation(this.program, 'flag.enableShadow');

        this.lightPositionUniform = this.gl.getUniformLocation(this.program, 'light.position');
        this.lightDirectionUniform = this.gl.getUniformLocation(this.program, 'light.direction');

        this.viewerProjectionUniform = this.gl.getUniformLocation(this.program, 'viewer.projection');
        this.viewerViewUniform = this.gl.getUniformLocation(this.program, 'viewer.view');

        this.transformationMatrixUniform = this.gl.getUniformLocation(this.program, 'transformationMatrix');
        this.normalMatrixUniform = this.gl.getUniformLocation(this.program, 'normalMatrix');

        this.lightShadowMapUniform = this.gl.getUniformLocation(this.program, 'lightShadowMap');
    }

    activate() {
        this.gl.useProgram(this.program);
        return this;
    }

    setCoefficientUniform(coefficient) {
        this.gl.uniform3fv(this.coefficientAmbientUniform, coefficient.ambient);
        this.gl.uniform3fv(this.coefficientDiffuseUniform, coefficient.diffuse);
        this.gl.uniform3fv(this.coefficientSpecularUniform, coefficient.specular);
        this.gl.uniform1f(this.coefficientShininessUniform, coefficient.shininess);
        this.gl.uniform1f(this.coefficientF0Uniform, coefficient.F0);
        this.gl.uniform1f(this.coefficientRoughnessUniform, coefficient.roughness);
        this.gl.uniform1f(this.coefficientInnerCutoffUniform, coefficient.innerCutoff);
        this.gl.uniform1f(this.coefficientOuterCutoffUniform, coefficient.outerCutoff);
        this.gl.uniform2fv(this.coefficientShadowClipNearFarUniform, coefficient.shadowClipNearFar);
        this.gl.uniform1f(this.coefficientBiasUniform, coefficient.bias);

        this.gl.uniform1i(this.lightShadowMapUniform, 0);
    }

    setFlagUniform(flag) {
        this.gl.uniform1i(this.flagEnableSpecular, flag.enableSpecular ? 1 : 0);
        this.gl.uniform1i(this.flagEnableCookTorrance, flag.enableCookTorrance ? 1 : 0);
        this.gl.uniform1i(this.flagEnableSpotlight, flag.enableSpotlight ? 1 : 0);
        this.gl.uniform1i(this.flagEnableShadow, flag.enableShadow ? 1 : 0);
    }

    setLightUniform(position, direction) {
        this.gl.uniform3fv(this.lightPositionUniform, position);
        this.gl.uniform3fv(this.lightDirectionUniform, direction);
    }

    setViewerUniform(projection, view) {
        this.gl.uniformMatrix4fv(this.viewerProjectionUniform, false, projection);
        this.gl.uniformMatrix4fv(this.viewerViewUniform, false, view);
    }

    setTransformationUniform(transformation) {
        // normalMatrix = inverseTranspose(mat3(transformationMatrix))
        const normalMatrix = glm.mat3.create();
        glm.mat3.normalFromMat4(normalMatrix, transformation);

        this.gl.uniformMatrix4fv(this.transformationMatrixUniform, false, transformation);
        this.gl.uniformMatrix3fv(this.normalMatrixUniform, false, normalMatrix);
    }
}