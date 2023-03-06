import { UqApp } from "app/UqApp";

export abstract class Parts {
    readonly uqApp: UqApp;

    constructor(uqApp: UqApp) {
        this.uqApp = uqApp;
    }
}

export interface PartsProps<T extends Parts> {
    Parts: new (uqApp: UqApp) => T;
}

