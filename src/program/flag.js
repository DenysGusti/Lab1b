export class Flag {
    enableSpecular;
    enableCookTorrance;
    enableSpotlight;
    enableShadow;

    constructor(enableSpecular, enableCookTorrance, enableSpotlight, enableShadow) {
        this.enableSpecular = enableSpecular;
        this.enableCookTorrance = enableCookTorrance;
        this.enableSpotlight = enableSpotlight;
        this.enableShadow = enableShadow;
    }
}