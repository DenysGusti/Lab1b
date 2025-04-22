import * as glm from './gl-matrix/index.js';
import {Flag} from "./program/flag.js";

export class InputHandler {
    static modes = {
        shape: 0,
        global: 1,
        light: 2,
        camera: 3
    }

    shapeManager;
    programs;
    shapes;
    global;
    camera;
    light;

    currentMode = InputHandler.modes.camera;
    selectedIndex = -1;
    currentProgram = null;
    flag = new Flag(false, false, false, false);

    static getModeName = (value) =>
        Object.keys(InputHandler.modes).find(key => InputHandler.modes[key] === value);

    constructor(shapeManager, programs, shapes, global, camera, light) {
        this.shapeManager = shapeManager;
        this.programs = programs;
        this.shapes = shapes;
        this.global = global;
        this.camera = camera;
        this.light = light;

        this.currentProgram = this.programs["gouraud"];

        this.initKeyboardControls();
        this.initMouseControls();
        this.initOBJButton();

        document.getElementById("mode-display").textContent =
            `Mode: ${InputHandler.getModeName(this.currentMode)}`;
    }

    initKeyboardControls() {
        document.addEventListener("keydown", (event) => {
            this.handleSelection(event);
            this.handleTransformation(event);
            this.handleIllumination(event);
            this.handleLight(event);
            this.handleShadow(event);
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
            if (!isDragging)
                return;

            const deltaX = (event.clientX - lastX) * step;
            const deltaY = (event.clientY - lastY) * step;

            this.camera.translate([-deltaX, deltaY, 0]);

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
                if (this.selectedIndex >= 0) {
                    this.shapes[this.selectedIndex].selectableObject.selected = false;
                }
                this.selectedIndex = parseInt(event.key) - 1;

                this.shapes[this.selectedIndex].selectableObject.selected = true;
                this.global.selectableObject.selected = false;
                this.light.selectableObject.selected = false;
                this.camera.selectableObject.selected = false;

                this.currentMode = InputHandler.modes.shape;

                break;

            case "0":
                if (this.selectedIndex >= 0) {
                    this.shapes[this.selectedIndex].selectableObject.selected = false;
                }
                this.selectedIndex = -1;

                this.global.selectableObject.selected = true;
                this.light.selectableObject.selected = false;
                this.camera.selectableObject.selected = false;

                this.currentMode = InputHandler.modes.global;

                break;

            case "L":
                if (this.selectedIndex >= 0) {
                    this.shapes[this.selectedIndex].selectableObject.selected = false;
                }
                this.selectedIndex = -1;

                this.global.selectableObject.selected = false;
                this.light.selectableObject.selected = true;
                this.camera.selectableObject.selected = false;

                this.currentMode = InputHandler.modes.light;

                break;

            case " ":
                if (this.selectedIndex >= 0) {
                    this.shapes[this.selectedIndex].selectableObject.selected = false;
                }
                this.selectedIndex = -1;

                this.global.selectableObject.selected = false;
                this.light.selectableObject.selected = false;
                this.camera.selectableObject.selected = true;

                this.currentMode = InputHandler.modes.camera;

                break;
        }
        document.getElementById("mode-display").textContent =
            `Mode: ${InputHandler.getModeName(this.currentMode)}`;
    }

    handleTransformation(event) {
        const stepScale = 0.1;
        const stepTranslation = 0.1;
        const angle = glm.glMatrix.toRadian(5);

        const selectedObject = (() => {
            switch (this.currentMode) {
                case InputHandler.modes.shape:
                    return this.shapes[this.selectedIndex];
                case InputHandler.modes.global:
                    return this.global;
                case InputHandler.modes.light:
                    return this.light;
                case InputHandler.modes.camera:
                    return this.camera;
            }
        })();

        switch (this.currentMode) {
            case InputHandler.modes.shape:
            case InputHandler.modes.global: {
                switch (event.key) {
                    case "a":
                        selectedObject.scale([1 - stepScale, 1, 1]);
                        break;
                    case "A":
                        selectedObject.scale([1 + stepScale, 1, 1]);
                        break;
                    case "b":
                        selectedObject.scale([1, 1 - stepScale, 1]);
                        break;
                    case "B":
                        selectedObject.scale([1, 1 + stepScale, 1]);
                        break;
                    case "c":
                        selectedObject.scale([1, 1, 1 - stepScale]);
                        break;
                    case "C":
                        selectedObject.scale([1, 1, 1 + stepScale]);
                        break;
                }
            }
            case InputHandler.modes.light: {
                switch (event.key) {
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
                }
            }
            case InputHandler.modes.camera: {
                switch (event.key) {
                    case "ArrowRight":
                        selectedObject.translate([stepTranslation, 0, 0]);
                        break;
                    case "ArrowLeft":
                        selectedObject.translate([-stepTranslation, 0, 0]);
                        break;
                    case "ArrowUp":
                        selectedObject.translate([0, stepTranslation, 0]);
                        break;
                    case "ArrowDown":
                        selectedObject.translate([0, -stepTranslation, 0]);
                        break;
                    case ",":
                        selectedObject.translate([0, 0, stepTranslation]);
                        break;
                    case ".":
                        selectedObject.translate([0, 0, -stepTranslation]);
                        break;
                }
            }
        }
    }

    handleIllumination(event) {
        if (this.currentMode !== InputHandler.modes.camera)
            return;

        switch (event.key) {
            case "w":
                this.currentProgram = this.programs["gouraud"];
                this.flag.enableSpecular = false;
                this.flag.enableCookTorrance = false;
                break;
            case "e":
                this.currentProgram = this.programs["gouraud"];
                this.flag.enableSpecular = true;
                this.flag.enableCookTorrance = false;
                break;
            case "r":
                this.currentProgram = this.programs["phong"];
                this.flag.enableSpecular = false;
                this.flag.enableCookTorrance = false;
                break;
            case "t":
                this.currentProgram = this.programs["phong"];
                this.flag.enableSpecular = true;
                this.flag.enableCookTorrance = false;
                break;
            case "k":
                this.currentProgram = this.programs["phong"];
                this.flag.enableSpecular = true;
                this.flag.enableCookTorrance = true;
                break;
        }
    }

    handleLight(event) {
        if (this.currentMode === InputHandler.modes.camera)
            return;

        if (event.key === "t") {
            this.flag.enableSpotlight = !this.flag.enableSpotlight;
        }
    }

    handleShadow(event) {
        if (event.key === "h") {
            this.flag.enableShadow = !this.flag.enableShadow;
        }
    }

    initOBJButton() {
        document.getElementById("objFileInput").addEventListener("change", (event) => {
            this.handleOBJFile(event);
        });
    }

    handleOBJReader(event) {
        const objText = event.target.result;

        const objName = Object.keys(this.shapeManager.objVao).length.toString();
        this.shapeManager.addOBJ(objName, objText);

        this.shapes[this.selectedIndex].vao = this.shapeManager.objVao[objName];
        // old object can be too big
        this.shapes[this.selectedIndex].scalingMatrix = glm.mat4.create();
    }

    handleOBJFile(event) {
        const file = event.target.files[0];
        if (!file)
            return;
        // if not chosen, model loads into center shape
        if (this.currentMode !== InputHandler.modes.shape) {
            if (this.selectedIndex >= 0) {
                this.shapes[this.selectedIndex].selectableObject.selected = false;
            }
            this.currentMode = InputHandler.modes.shape;
            this.selectedIndex = 4;

            this.shapes[this.selectedIndex].selectableObject.selected = true;
            this.global.selectableObject.selected = false;
            this.light.selectableObject.selected = false;
            this.camera.selectableObject.selected = false;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.handleOBJReader(e);
        };

        reader.readAsText(file);
    }
}