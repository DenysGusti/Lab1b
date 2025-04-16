export function printMat4(m) {
    for (let i = 0; i < 4; i++) {
        const row = [
            m[i],       // column 0
            m[i + 4],   // column 1
            m[i + 8],   // column 2
            m[i + 12]   // column 3
        ];
        console.log(row.map(n => n.toFixed(2)).join('\t'));
    }
}

export function printMat3(m) {
    for (let i = 0; i < 3; i++) {
        const row = [
            m[i],       // column 0
            m[i + 3],   // column 1
            m[i + 6],   // column 2
        ];
        console.log(row.map(n => n.toFixed(2)).join('\t'));
    }
}