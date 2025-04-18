// taken from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Creating_3D_objects_using_WebGL
export const CUBE_VERTICES = [
    // Front face
    -1, -1, 1,
    1, -1, 1,
    1, 1, 1,
    -1, 1, 1,

    // Back face
    -1, -1, -1,
    -1, 1, -1,
    1, 1, -1,
    1, -1, -1,

    // Top face
    -1, 1, -1,
    -1, 1, 1,
    1, 1, 1,
    1, 1, -1,

    // Bottom face
    -1, -1, -1,
    1, -1, -1,
    1, -1, 1,
    -1, -1, 1,

    // Right face
    1, -1, -1,
    1, 1, -1,
    1, 1, 1,
    1, -1, 1,

    // Left face
    -1, -1, -1,
    -1, -1, 1,
    -1, 1, 1,
    -1, 1, -1,
];

export const CUBE_COLORS = [
    [0.8, 0.8, 0.8], // Front face: white
    [0.8, 0, 0], // Back face: red
    [0, 0.8, 0], // Top face: green
    [0, 0, 0.8], // Bottom face: blue
    [0.8, 0.8, 0], // Right face: yellow
    [0.8, 0, 0.8], // Left face: purple
];

export const CUBE_NORMALS = [
    [0, 0, 1],  // Front face
    [0, 0, -1],  // Back face
    [0, 1, 0],  // Top face
    [0, -1, 0],  // Bottom face
    [1, 0, 0],  // Right face
    [-1, 0, 0] // Left face
];

// gl.CULL_FACE compliant
export const CUBE_INDICES = new Uint16Array([
    // Front face
    0, 1, 2,
    0, 2, 3,

    // Back face
    4, 5, 6,
    4, 6, 7,

    // Top face
    8, 9, 10,
    8, 10, 11,

    // Bottom face
    12, 13, 14,
    12, 14, 15,

    // Right face
    16, 17, 18,
    16, 18, 19,

    // Left face
    20, 21, 22,
    20, 22, 23,
]);

// interleaved format: (x, y, z, r, g, b, nx, ny, nz) (all f32)
export function createInterleavedCube(vertices, faceColors, faceNormals) {
    let interleavedArray = [];

    for (let i = 0; i < vertices.length; i += 12) { // Each face has 4 vertices
        const color = faceColors[i / 12];   // Get color for the face
        const normal = faceNormals[i / 12]; // Get normal for the face

        for (let j = 0; j < 12; j += 3) { // Each vertex has 3 components (x, y, z)
            const vertex = vertices.slice(i + j, i + j + 3);
            interleavedArray.push(
                ...vertex, // x, y, z
                ...color,  // r, g, b
                ...normal  // nx, ny, nz
            );
        }
    }

    return new Float32Array(interleavedArray);
}