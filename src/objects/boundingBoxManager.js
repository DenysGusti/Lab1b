import * as glm from "../gl-matrix/index.js";

export class BoundingBoxManager {
    originalVertices;
    transformedVertices;

    minCoords = null;
    maxCoords = null;

    boundingBox = glm.mat4.create();

    // interleaved format: (x, y, z, r, g, b, nx, ny, nz) (all f32)
    constructor(vertices) {
        this.originalVertices = vertices;
        this.transformedVertices = vertices.slice();
        this.transformInterleavedVertices();
    }

    transformInterleavedVertices() {
        this.calculateSize();
        this.createBoundingBox();

        for (let i = 0; i < this.originalVertices.length; i += 9) {
            const vertex = [...this.originalVertices.slice(i, i + 3), 1];
            const transformed = glm.vec4.create();
            glm.vec4.transformMat4(transformed, vertex, this.boundingBox);
            [this.transformedVertices[i], this.transformedVertices[i + 1], this.transformedVertices[i + 2]] = transformed;
        }
    }

    calculateSize() {
        for (let i = 0; i < this.originalVertices.length; i += 9) {
            this.updateDimensions(this.originalVertices.slice(i, i + 3));
        }
    }

    updateDimensions(vertex) {
        if (this.minCoords == null || this.maxCoords == null) {
            this.minCoords = vertex.slice();
            this.maxCoords = vertex.slice();
        } else {
            for (let i = 0; i < 3; i++) {
                this.minCoords[i] = Math.min(vertex[i], this.minCoords[i]);
                this.maxCoords[i] = Math.max(vertex[i], this.maxCoords[i]);
            }
        }
    }

    createBoundingBox() {
        const [minX, minY, minZ] = this.minCoords;
        const [maxX, maxY, maxZ] = this.maxCoords;
        // uniform scaling, minimal length is 1
        const scaleFactor = 1 / Math.min((maxX - minX), (maxY - minY), (maxZ - minZ));
        glm.mat4.scale(this.boundingBox, this.boundingBox, [scaleFactor, scaleFactor, scaleFactor]);
        // put center of a shape in (0, 0, 0)
        const offsetVec = [-(minX + maxX) / 2, -(minY + maxY) / 2, -(minZ + maxZ) / 2];
        glm.mat4.translate(this.boundingBox, this.boundingBox, offsetVec);
    }
}