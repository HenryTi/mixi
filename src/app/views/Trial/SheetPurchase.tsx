import { UqApp, useUqApp } from "app/UqApp";
import { Route } from "react-router-dom";
import { UqAction, UqID } from "tonwa-uq";
import { PageSheetEdit, PageSheetList, PageSheetNew, SheetParts } from "../../templet/Sheet";
import { PageProductSelect } from "./IDProduct";

export const purchaseCaption = '采购单';
export const pathPurchase = 'purchase';
const pathPurchaseNew = 'purchase-new';
const pathPurchaseEdit = 'purchase-edit';

class SheetPurchaseParts extends SheetParts {
    readonly IDSheet: UqID<any>;
    readonly ActBookSheet: UqAction<any, any>;
    readonly caption: string;
    PageDetailItemSelect: (props: { onItemClick: (item: any) => Promise<void>; }) => JSX.Element;
    readonly pathSheetEdit: string
    readonly pathSheetNew: string;

    constructor(uqApp: UqApp) {
        super(uqApp);
        const { JsTicket } = uqApp.uqs;
        this.IDSheet = JsTicket.SheetPurchase;
        this.ActBookSheet = JsTicket.BookSheetPurchase;
        this.PageDetailItemSelect = PageProductSelect;
        this.pathSheetEdit = pathPurchaseEdit;
        this.pathSheetNew = pathPurchaseNew;
        this.caption = purchaseCaption;
    }
}

function useSheetParts() {
    const uqApp = useUqApp();
    const sheetParts = uqApp.fromCache('SheetPurchase', SheetPurchaseParts as any);
    return sheetParts;
}

function PagePurchaseEdit() {
    const sheetParts = useSheetParts();
    return <PageSheetEdit parts={sheetParts} />;
}

function PagePurchaseNew() {
    const sheetParts = useSheetParts();
    return <PageSheetNew parts={sheetParts} />;
}

function PagePurchaseList() {
    const sheetParts = useSheetParts();
    return <PageSheetList parts={sheetParts} />;
}

export const routeSheetPurchase = <>
    <Route path={pathPurchase} element={<PagePurchaseList />} />
    <Route path={pathPurchaseNew} element={<PagePurchaseNew />} />
    <Route path={`${pathPurchaseEdit}/:id`} element={<PagePurchaseEdit />} />
    <Route path={pathPurchaseEdit} element={<PagePurchaseEdit />} />
</>;
