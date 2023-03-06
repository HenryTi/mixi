import { FormRow } from "app/coms";
import { UqID, UqQuery } from "tonwa-uq";
import { Parts } from "../Parts";

export interface IDViewRowProps {
    name: string;
    label: string;
    readonly?: boolean;
}

export abstract class IDParts extends Parts {
    // IDList
    readonly abstract caption: string;
    readonly abstract ViewItem: (value: any) => JSX.Element;
    readonly abstract query: UqQuery<any, any>;
    readonly abstract listTop?: JSX.Element;

    // IDNew
    readonly abstract ID: UqID<any>;
    readonly abstract formRows: FormRow[];
    readonly abstract onNo: (no: string) => void;
    readonly abstract actSave: (no: string, data: any) => Promise<any>;

    // IDSelect
    readonly abstract placeholder?: string;
    //readonly abstract onItemClick: (item: any) => Promise<void>;
    readonly abstract autoLoadOnOpen?: boolean;   // auto load data on open

    // IDView
    readonly abstract viewRows: IDViewRowProps[];
}
