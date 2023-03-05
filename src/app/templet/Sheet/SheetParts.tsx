import { UqApp } from "app/UqApp";
import { Uq, UqAction, UqID, UqIX, UqQuery } from "tonwa-uq";
import { Detail } from "uqs/JsTicket";

export abstract class SheetParts {
    readonly uqApp: UqApp;
    readonly uq: Uq;
    readonly IDDetail: UqID<Detail>;
    readonly IxMySheet: UqIX<any>;
    readonly QuerySearchSheetItem: UqQuery<any, any>;
    readonly QueryGetDetails: UqQuery<{ id: number }, { ret: any[] }>;
    abstract get IDSheet(): UqID<any>;
    abstract get ActBookSheet(): UqAction<any, any>;
    abstract get caption(): string;
    abstract get PageDetailItemSelect(): (props: { onItemClick: (item: any) => Promise<void> }) => JSX.Element;
    abstract get pathSheetEdit(): string;
    abstract get pathSheetNew(): string;

    constructor(uqApp: UqApp) {
        let uq = uqApp.uqs.JsTicket;
        this.uq = uq;
        this.IDDetail = uq.Detail;
        this.QueryGetDetails = uq.GetDetails;
        this.IxMySheet = uq.IxMySheet;
    }
}
