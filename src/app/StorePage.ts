import { UQs } from "uqs";
import { UqApp } from "./UqApp";

export class StorePage {
    readonly uqApp: UqApp;
    protected readonly uqs: UQs;
    constructor(uqApp: UqApp) {
        this.uqApp = uqApp;
        this.uqs = uqApp.uqs;
    }

    async init(): Promise<void> {
    }
}
