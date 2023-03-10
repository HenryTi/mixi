import { UqApp } from "app/UqApp";
import { Uq, UqAction, UqID, UqIX, UqQuery } from "tonwa-uq";
import { DetailQPA } from "uqs/JsTicket";
import { Parts, PartsProps } from "../Parts";

export abstract class SheetParts extends Parts {
    get name(): string { return this.IDSheet.name; }
    abstract pathSheet: string;
    abstract pathNew: string;
    abstract pathEdit: string;

    abstract get IDSheet(): UqID<any>;
    abstract IDDetail: UqID<DetailQPA>;
    readonly IxMySheet: UqIX<any>;
    abstract QueryGetDetails: UqQuery<{ id: number }, { ret: any[] }>;
    abstract get ActBookSheet(): UqAction<any, any>;
    abstract get QuerySearchSheetItem(): UqQuery<any, any>;
    abstract get QuerySource(): UqQuery<any, any>;

    abstract get caption(): string;

    abstract PageDetailItemSelect: (props: { onItemClick: (item: any) => Promise<void> }) => JSX.Element;
    abstract ModalSheetEdit: (props: { id: number }) => JSX.Element;
    abstract PageSheetEdit: () => JSX.Element;
    abstract PageSheetNew: () => JSX.Element;
    abstract PageSheetDetail: <T extends DetailQPA>(props: (PartsProps<SheetParts> & { detail: Partial<T>; })) => JSX.Element;
    abstract ViewNO: (props: { no: string }) => JSX.Element;
    abstract ViewTarget: (props: { target: number }) => JSX.Element;
    abstract ViewItemDetail: ({ value }: { value: any; }) => JSX.Element;
    abstract ViewItemSheet: ({ id }: { id: number; }) => JSX.Element;
    abstract ViewItemSource: ({ id }: { id: number; }) => JSX.Element;
    abstract sourceSearchPlaceholder: string;

    constructor(uqApp: UqApp) {
        super(uqApp);
        let uq = this.uq;
        this.IxMySheet = uq.IxMySheet;
    }
}
