const AXIS_LIMIT = 1.5;

export const COORDINATE_SYSTEM_VERTICES = [
    -AXIS_LIMIT, 0, 0,
    AXIS_LIMIT, 0, 0,  // X-axis

    0, -AXIS_LIMIT, 0,
    0, AXIS_LIMIT, 0,  // Y-axis

    0, 0, -AXIS_LIMIT,
    0, 0, AXIS_LIMIT   // Z-axis
];

export const COORDINATE_SYSTEM_COLORS = [
    [1, 0, 0],  // Red for X-axis
    [0, 1, 0],  // Green for Y-axis
    [0, 0, 1]   // Blue for Z-axis
];

export const COORDINATE_SYSTEM_NORMALS = [
    [1, 0, 0],  // X-axis
    [0, 1, 0],  // Y-axis
    [0, 0, 1]   // Z-axis
];

export const COORDINATE_SYSTEM_INDICES = new Uint16Array([
    0, 1,  // X-axis
    2, 3,  // Y-axis
    4, 5   // Z-axis
]);

// interleaved format: (x, y, z, r, g, b, nx, ny, nz) (all f32)
export function createInterleavedCoordinateSystem(vertices, lineColors, lineNormals) {
    let interleavedArray = [];

    for (let i = 0; i < vertices.length; i += 6) { // Each line has 2 vertices
        const color = lineColors[i / 6];    // Get color for the line
        const normal = lineNormals[i / 6];

        for (let j = 0; j < 6; j += 3) { // Each vertex has 3 components (x, y, z)
            const vertex = vertices.slice(i + j, i + j + 3);
            interleavedArray.push(
                ...vertex,  // x, y, z
                ...color,   // r, g, b
                ...normal   // nx, ny, nz
            );
        }
    }

    return new Float32Array(interleavedArray);
}