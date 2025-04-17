import {GlobalTransformationObject} from "../transformation_object/global_transformation_object.js";

export class GlobalCoordinateSystem extends GlobalTransformationObject {
    selectableObject;

    constructor(selectableObject) {
        super();

        this.selectableObject = selectableObject;
    }
}