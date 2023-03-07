import { UqApp } from "app/UqApp";
import { Uq, UqAction, UqID, UqIX, UqQuery } from "tonwa-uq";
import { Detail, DetailQPA } from "uqs/JsTicket";
import { Parts, PartsProps } from "../Parts";

export abstract class SheetParts extends Parts {
    readonly uq: Uq;

    readonly IxMySheet: UqIX<any>;
    abstract QueryGetDetails: UqQuery<{ id: number }, { ret: any[] }>;
    abstract get IDSheet(): UqID<any>;
    abstract IDDetail: UqID<DetailQPA>;
    abstract get ActBookSheet(): UqAction<any, any>;
    abstract get QuerySearchSheetItem(): UqQuery<any, any>;
    abstract get caption(): string;

    abstract PageDetailItemSelect: (props: { onItemClick: (item: any) => Promise<void> }) => JSX.Element;
    abstract PageSheetEdit: (props: { id: number }) => JSX.Element;
    abstract PageSheetNew: () => JSX.Element;
    abstract PageSheetDetail: <T extends DetailQPA>(props: (PartsProps<SheetParts> & { detail: Partial<T>; })) => JSX.Element;
    abstract ViewNO: (props: { no: string }) => JSX.Element;
    abstract ViewTarget: (props: { target: number }) => JSX.Element;
    abstract ViewItemSheet: ({ value }: { value: any }) => JSX.Element;

    constructor(uqApp: UqApp) {
        super(uqApp);
        let uq = uqApp.uqs.JsTicket;
        this.uq = uq;
        this.IxMySheet = uq.IxMySheet;
    }
}
