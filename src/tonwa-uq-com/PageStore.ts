import { UqApp } from "./UqApp";

export abstract class PageStore<UQApp extends UqApp<UQS> = any, UQS = any, P = any> {
    readonly uqApp: UQApp;
    protected readonly uqs: UQS;
    constructor(uqApp: UQApp) {
        this.uqApp = uqApp;
        this.uqs = uqApp.uqs;
    }

    async init(): Promise<void> {
    }
}
