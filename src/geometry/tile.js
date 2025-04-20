export const TILE_LIMIT = 0.5;

export const TILE_VERTICES = [
    -TILE_LIMIT, 0, -TILE_LIMIT,
    TILE_LIMIT, 0, -TILE_LIMIT,
    TILE_LIMIT, 0, TILE_LIMIT,
    -TILE_LIMIT, 0, TILE_LIMIT
];

export const TILE_COLORS = [
    [0.8, 0.8, 0.8],
];

export const TILE_NORMALS = [
    [0, 1, 0],
];

// gl.CULL_FACE compliant
export const TILE_INDICES = new Uint16Array([
    0, 2, 1,
    0, 3, 2,
]);

// interleaved format: (x, y, z, r, g, b, nx, ny, nz) (all f32)
export function createInterleavedTile(vertices, faceColors, faceNormals) {
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