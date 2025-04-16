// based on https://webglfundamentals.org/webgl/lessons/webgl-load-obj.html
export class OBJParser {
    name;
    vertices = []; // triangle vertices (x, y, z), ccw by default
    texCoords = [];
    normals = [];

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
    }

    // interleaved format: (x, y, z, r, g, b, nx, ny, nz) (all f32)
    getVertexData() {
        const vertexData = [];

        for (let i = 0; i < this.vertices.length; i += 9) { // Process 3 vertices (1 triangle) at a time
            const randomColor = [Math.random(), Math.random(), Math.random()];

            for (let j = 0; j < 9; j += 3) {
                const vertex = this.vertices.slice(i + j, i + j + 3);
                const normal = this.normals.slice(i + j, i + j + 3);
                vertexData.push(...vertex, ...randomColor, ...normal);
            }
        }

        return new Float32Array(vertexData);
    }

    getIndexData() {
        // just range, number of vertices is length of this.vertices (x, y, z) / 3
        return new Uint16Array([...Array(this.vertices.length / 3).keys()]);
    }
}
