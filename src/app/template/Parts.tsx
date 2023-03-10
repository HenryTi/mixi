import { UqApp } from "app/UqApp";
import { JsTicket } from "uqs";

export abstract class Parts {
    abstract get name(): string;
    readonly uqApp: UqApp;
    readonly uq: JsTicket.UqExt;

    constructor(uqApp: UqApp) {
        this.uqApp = uqApp;
        this.uq = uqApp.uqs.JsTicket;
    }
}

export interface PartsProps<T extends Parts> {
    Parts: new (uqApp: UqApp) => T;
}

