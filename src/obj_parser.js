import * as glm from './gl-matrix/index.js';
import {printMat4} from "./utils.js";

// based on https://webglfundamentals.org/webgl/lessons/webgl-load-obj.html
export class OBJParser {
    static DEFAULT_COLOR = [0.5, 0.8, 0.8];

    name;
    vertices = []; // triangle vertices (x, y, z), ccw by default
    texCoords = [];
    normals = [];

    boundingBox = glm.mat4.create();

    constructor(objText) {
        this.parseOBJ(objText);
    }

    parseOBJ(objText) {
        // filled with 0 because index starts from 1
        const tmpVertices = [[0, 0, 0]];  // unique vertices
        const tmpTexCoords = [[0, 0]];
        const tmpNormals = [[0, 0, 0]];

        // arrays of references, same order as face indices
        const tmpVertexData = [
            tmpVertices,
            tmpTexCoords,
            tmpNormals,
        ];

        const finalVertexData = [
            this.vertices,  // triangle vertices
            this.texCoords,
            this.normals
        ];

        let minX = 0;
        let minY = 0;
        let minZ = 0;

        let maxX = 0;
        let maxY = 0;
        let maxZ = 0;

        const lines = objText.split("\n");

        for (let line of lines) {
            line = line.trim();
            if (line.startsWith("#") || line.length === 0) continue;

            let parts = line.split(/\s+/);
            const keyword = parts[0];
            parts = parts.slice(1);

            switch (keyword) {
                case "o": // Object Name
                    this.name = parts[0];
                    break;
                case "v": // Vertex position
                    const [x, y, z] = parts.map(parseFloat);

                    minX = Math.min(x, minX);
                    minY = Math.min(y, minY);
                    minZ = Math.min(z, minZ);

                    maxX = Math.max(x, maxX);
                    maxY = Math.max(y, maxY);
                    maxZ = Math.max(z, maxZ);

                    tmpVertices.push(parts.map(parseFloat));
                    break;
                case "vt": // Texture coordinate
                    tmpTexCoords.push(parts.map(parseFloat));
                    break;
                case "vn": // Normal
                    tmpNormals.push(parts.map(parseFloat));
                    break;
                case "f": // Face
                    for (const vertexIndices of parts) {
                        const indicesStr = vertexIndices.split('/');
                        // create triangles
                        for (const [i, indexStr] of indicesStr.entries()) {
                            if (indexStr) {
                                const index = parseInt(indexStr);
                                finalVertexData[i].push(...tmpVertexData[i][index]);
                            }
                        }
                    }
            }
        }
        // uniform scaling, minimal length is 1
        const scaleFactor = 1 / Math.min((maxX - minX), (maxY - minY), (maxZ - minZ));
        glm.mat4.scale(this.boundingBox, this.boundingBox, [scaleFactor, scaleFactor, scaleFactor]);
        // put center of a shape in (0, 0, 0)
        const offsetVec = [-(minX + maxX) / 2, -(minY + maxY) / 2, -(minZ + maxZ) / 2];
        glm.mat4.translate(this.boundingBox, this.boundingBox, offsetVec);
    }

    // interleaved format: (x, y, z, r, g, b, nx, ny, nz) (all f32)
    getVertexData() {
        const vertexData = [];

        for (let i = 0; i < this.vertices.length; i += 9) { // Process 3 vertices (1 triangle) at a time

            for (let j = 0; j < 9; j += 3) {
                let vertex = this.vertices.slice(i + j, i + j + 3);

                const vertex4 = glm.vec4.create();
                glm.vec4.transformMat4(vertex4, [...vertex, 1], this.boundingBox);
                vertex = vertex4.slice(0, 3);

                const normal = this.normals.slice(i + j, i + j + 3);
                vertexData.push(...vertex, ...OBJParser.DEFAULT_COLOR, ...normal);
            }
        }

        return new Float32Array(vertexData);
    }

    getIndexData() {
        // just range, number of vertices is length of this.vertices (x, y, z) / 3
        return new Uint16Array([...Array(this.vertices.length / 3).keys()]);
    }
}
