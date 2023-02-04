import { StorePageBase } from "tonwa-app";
import { UQs } from "uqs";
import { uqApp, UqApp } from "./UqApp";

export class StorePage extends StorePageBase<UqApp, UQs> {
    constructor() {
        super(uqApp);
    }
}
