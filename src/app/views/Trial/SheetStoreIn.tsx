import { Route } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IDView, Page, useModal } from "tonwa-app";
import { UqAction, UqID, UqQuery } from "tonwa-uq";
import { PartsProps } from "app/template/Parts";
import { UqApp, useUqApp } from "app/UqApp";
import { DetailQPA } from "uqs/JsTicket";
import { PageSheetEdit, PageSheetList, PageSheetNew, SheetParts } from "../../template/Sheet";
import { PageProductSelect, ViewProduct } from "./IDProduct";
import { ChangeEvent, useState } from "react";
import { Band, FormRow, FormRowsView } from "app/coms";
import { FA, LMR } from "tonwa-com";
import { ViewContact } from "./IDContact";
import { SheetPartsPurchase } from "./SheetPurchase";

export const captionStoreIn = '入库单';
export const pathStoreIn = 'store-in';
const pathStoreInNew = 'store-in-new';
const pathStoreInEdit = 'store-in-edit';

export class SheetPartsStoreIn extends SheetParts {
    readonly pathSheet: string;
    readonly pathNew: string;
    readonly pathEdit: string;

    readonly IDSheet: UqID<any>;
    readonly IDDetail: UqID<any>;
    readonly QueryGetDetails: UqQuery<{ id: number }, { ret: any[] }>;
    readonly ActBookSheet: UqAction<any, any>;
    readonly QuerySearchSheetItem: UqQuery<any, any>;
    readonly QuerySource: UqQuery<any, any>;

    readonly caption: string;
    readonly PageDetailItemSelect: (props: { onItemClick: (item: any) => Promise<void>; }) => JSX.Element;
    readonly ModalSheetEdit: (props: { id: number; }) => JSX.Element;
    readonly PageSheetEdit: () => JSX.Element;
    readonly PageSheetNew: () => JSX.Element;
    readonly PageSheetDetail: <T extends DetailQPA>(props: PartsProps<SheetParts> & { detail: Partial<T>; }) => JSX.Element;
    readonly ViewNO: (props: { no: string }) => JSX.Element;
    readonly ViewTarget: (props: { target: number }) => JSX.Element;
    readonly ViewItemDetail: ({ value }: { value: any }) => JSX.Element;
    readonly ViewItemSheet: ({ id }: { id: number; }) => JSX.Element;
    readonly ViewItemSource: ({ id }: { id: number; }) => JSX.Element;
    readonly sourceSearchPlaceholder: string;

    constructor(uqApp: UqApp) {
        super(uqApp);
        const { JsTicket: uq } = uqApp.uqs;

        this.pathSheet = pathStoreIn;
        this.pathNew = pathStoreInNew;
        this.pathEdit = pathStoreInEdit;

        this.IDSheet = uq.SheetSale;
        this.IDDetail = uq.DetailQPA;
        this.QueryGetDetails = uq.GetDetailQPAs;
        this.QuerySource = uq.SearchStoreIn;

        this.caption = captionStoreIn;

        this.ViewItemSheet = ({ id }: { id: number; }) => {
            const ViewSheet = ({ value }: { value: any }) => {
                const { no, vendor } = value;
                return <div>
                    <small className="text-muted">{this.caption}</small> <b>{no}</b> &nbsp;
                    <IDView id={vendor} uq={uq} Template={ViewContact} />
                </div>
            }
            return <IDView id={id} uq={uq} Template={ViewSheet} />;
        }

        this.ViewItemSource = uqApp.fromCache(SheetPartsPurchase).ViewItemSheet;
        this.sourceSearchPlaceholder = '供应商编号或名称，或者采购单号';
    }
}

function PageStoreInList() {
    return <PageSheetList Parts={SheetPartsStoreIn} />;
}

export const routeSheetStoreIn = <Route path={pathStoreIn} element={<PageStoreInList />} />;
