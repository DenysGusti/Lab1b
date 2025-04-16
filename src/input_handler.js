import * as glm from './gl-matrix/index.js';

export class InputHandler {
    shapeManager;
    shapes;
    camera;
    globalTransform;

    selectedIndex = -1;
    cameraMode = true;

    constructor(shapeManager, shapes, camera, globalTransform) {
        this.shapeManager = shapeManager;
        this.shapes = shapes;
        this.camera = camera;
        this.globalTransform = globalTransform;

        this.initKeyboardControls();
        this.initMouseControls();
        this.initOBJButton();
    }

    initKeyboardControls() {
        document.addEventListener("keydown", (event) => {
            this.handleSelection(event);

            if (this.cameraMode) {
                this.handleCameraMovement(event);
            } else {
                this.handleTransformation(event);
            }
        });
    }

    initMouseControls() {
        const step = 0.01;
        let isDragging = false;
        let lastX, lastY;
        const canvas = document.getElementById("glCanvas");

        canvas.addEventListener("mousedown", (event) => {
            isDragging = true;
            lastX = event.clientX;
            lastY = event.clientY;
        });

        canvas.addEventListener("mouseup", () => {
            isDragging = false;
        });

        canvas.addEventListener("mouseleave", () => {
            isDragging = false; // Stop dragging when the mouse leaves the canvas
        });

        canvas.addEventListener("mousemove", (event) => {
            if (!isDragging) return;

            const deltaX = (event.clientX - lastX) * step;
            const deltaY = (event.clientY - lastY) * step;

            this.camera.translate([deltaX, -deltaY, 0]);

            lastX = event.clientX;
            lastY = event.clientY;
        });
    }

    handleSelection(event) {
        switch (event.key) {
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                if (this.selectedIndex >= 0)
                    this.shapes[this.selectedIndex].selected = false;

                this.selectedIndex = parseInt(event.key) - 1;
                this.shapes[this.selectedIndex].selected = true;
                this.cameraMode = false;
                break;

            case "0":
                if (this.selectedIndex >= 0)
                    this.shapes[this.selectedIndex].selected = false;

                this.selectedIndex = -1;
                this.cameraMode = false;
                break;

            case " ":
                if (this.selectedIndex >= 0)
                    this.shapes[this.selectedIndex].selected = false;

                this.selectedIndex = -1;
                this.cameraMode = true;
                break;
        }
    }

    handleCameraMovement(event) {
        const step = 0.1;
        switch (event.key) {
            case "ArrowRight":
                this.camera.translate([-step, 0, 0]);
                break;
            case "ArrowLeft":
                this.camera.translate([step, 0, 0]);
                break;
            case "ArrowUp":
                this.camera.translate([0, -step, 0]);
                break;
            case "ArrowDown":
                this.camera.translate([0, step, 0]);
                break;
        }
    }

    handleTransformation(event) {
        const step = 0.1;
        const angle = glm.glMatrix.toRadian(5);

        const selectedObject = this.selectedIndex >= 0 ? this.shapes[this.selectedIndex] : this.globalTransform;

        switch (event.key) {
            case "a":
                selectedObject.scale([0.9, 1, 1]);
                break;
            case "A":
                selectedObject.scale([1.1, 1, 1]);
                break;
            case "b":
                selectedObject.scale([1, 0.9, 1]);
                break;
            case "B":
                selectedObject.scale([1, 1.1, 1]);
                break;
            case "c":
                selectedObject.scale([1, 1, 0.9]);
                break;
            case "C":
                selectedObject.scale([1, 1, 1.1]);
                break;
            case "i":
                selectedObject.rotateX(-angle);
                break;
            case "k":
                selectedObject.rotateX(angle);
                break;
            case "o":
                selectedObject.rotateY(-angle);
                break;
            case "u":
                selectedObject.rotateY(angle);
                break;
            case "l":
                selectedObject.rotateZ(-angle);
                break;
            case "j":
                selectedObject.rotateZ(angle);
                break;
            case "ArrowRight":
                selectedObject.translate([step, 0, 0]);
                break;
            case "ArrowLeft":
                selectedObject.translate([-step, 0, 0]);
                break;
            case "ArrowUp":
                selectedObject.translate([0, step, 0]);
                break;
            case "ArrowDown":
                selectedObject.translate([0, -step, 0]);
                break;
            case ",":
                selectedObject.translate([0, 0, step]);
                break;
            case ".":
                selectedObject.translate([0, 0, -step]);
                break;
        }
    }

    initOBJButton() {
        document.getElementById("objFileInput").addEventListener("change", (event) => {
            this.handleOBJFile(event);
        });
    }

    handleOBJReader(event) {
        const objText = event.target.result;
        console.log(objText);

        const objName = Object.keys(this.shapeManager.objVao).length.toString();
        this.shapeManager.addOBJ(objName, objText);

        this.shapes[this.selectedIndex].setNewVao(
            this.shapeManager.objVao[objName], this.shapeManager.objNumIndices[objName]);
        // old object can be too big
        this.shapes[this.selectedIndex].scalingMatrix = glm.mat4.create();
    }

    handleOBJFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        // if not chosen, model loads into center shape
        if (this.selectedIndex < 0) {
            this.selectedIndex = 4;
            this.shapes[this.selectedIndex].selected = true;
            this.cameraMode = false;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.handleOBJReader(e);
        };

        reader.readAsText(file);
    }
}