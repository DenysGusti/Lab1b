export const OCTAHEDRON_VERTICES = [
    // Top front-left
    0, 1, 0,
    1, 0, 1,
    -1, 0, 1,

    // Top front-right
    0, 1, 0,
    1, 0, -1,
    1, 0, 1,

    // Top back-right
    0, 1, 0,
    -1, 0, -1,
    1, 0, -1,

    // Top back-left
    0, 1, 0,
    -1, 0, 1,
    -1, 0, -1,

    // Bottom front-left
    0, -1, 0,
    -1, 0, 1,
    1, 0, 1,

    // Bottom front-right
    0, -1, 0,
    1, 0, 1,
    1, 0, -1,

    // Bottom back-right
    0, -1, 0,
    1, 0, -1,
    -1, 0, -1,

    // Bottom back-left
    0, -1, 0,
    -1, 0, -1,
    -1, 0, 1,
];

export const OCTAHEDRON_COLORS = [
    [0.8, 0, 0],  // Red - Top front-left
    [0, 0.8, 0],  // Green - Top front-right
    [0, 0, 0.8],  // Blue - Top back-right
    [0.8, 0.8, 0],  // Yellow - Top back-left
    [0.8, 0, 0.8],  // Magenta - Bottom front-left
    [0, 0.8, 0.8],  // Cyan - Bottom front-right
    [0.8, 0.4, 0], // Orange - Bottom back-right
    [0.4, 0, 0.8]  // Purple - Bottom back-left
];

export const OCTAHEDRON_NORMALS = [
    // Top front-left
    [0, 0.7071, 0.7071], // approx (0, √2/2, √2/2)

    // Top front-right
    [0.7071, 0.7071, 0], // approx (√2/2, √2/2, 0)

    // Top back-right
    [0, 0.7071, -0.7071],

    // Top back-left
    [-0.7071, 0.7071, 0],

    // Bottom front-left
    [0, -0.7071, 0.7071],

    // Bottom front-right
    [0.7071, -0.7071, 0],

    // Bottom back-right
    [0, -0.7071, -0.7071],

    // Bottom back-left
    [-0.7071, -0.7071, 0]
];

// gl.CULL_FACE compliant
export const OCTAHEDRON_INDICES = new Uint16Array([
    0, 2, 1,   // Top front-left
    3, 5, 4,   // Top front-right
    6, 8, 7,   // Top back-right
    9, 11, 10,  // Top back-left
    12, 14, 13,  // Bottom front-left
    15, 17, 16,  // Bottom front-right
    18, 20, 19,  // Bottom back-right
    21, 23, 22   // Bottom back-left
]);

// interleaved format: (x, y, z, r, g, b, nx, ny, nz) (all f32)
export function createInterleavedOctahedron(vertices, faceColors, faceNormals) {
    let interleavedArray = [];

    for (let i = 0; i < vertices.length; i += 9) { // Each face has 3 vertices
        const color = faceColors[i / 9];    // Get color for the face
        const normal = faceNormals[i / 9];  // Get normal for the face

        for (let j = 0; j < 9; j += 3) { // Each vertex has 3 components (x, y, z)
            const vertex = vertices.slice(i + j, i + j + 3);
            interleavedArray.push(
                ...vertex, // x, y, z
                ...color,   // r, g, b
                ...normal   // nx, ny, nz
            );
        }
    }

    return new Float32Array(interleavedArray);
}