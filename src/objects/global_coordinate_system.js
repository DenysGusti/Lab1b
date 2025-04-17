import {GlobalTransformationObject} from "../transformation_object/global_transformation_object.js";
import {SelectableObject} from "./selectable_object.js";

export class GlobalCoordinateSystem extends GlobalTransformationObject {
    selectableObject;

    constructor(coordinateSystemVao) {
        super();

        this.selectableObject = new SelectableObject(coordinateSystemVao);
    }
}