export class SelectableObject {
    coordinateSystemVao;

    selected = false;

    constructor(coordinateSystemVao) {
        this.coordinateSystemVao = coordinateSystemVao;
    }

    // show coordinate axes
    drawCoordinateSystem() {
        if (this.selected) {
            this.coordinateSystemVao.draw();
        }
    }
}