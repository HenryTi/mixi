import { FormInput, FormRow } from "app/coms";
import { PageIDList, PageIDNew, PageIDView, IDViewRowProps, IDParts, PageIDSelect } from "app/template/ID";
import { UqApp, useUqApp } from "app/UqApp";
import { Link, Route } from "react-router-dom";
import { UqQuery, UqID, Uq } from "tonwa-uq";
import { Product } from "uqs/JsTicket";

export const pathProductNew = 'product-new';
export const pathProductList = 'product-list';
export const pathProductView = 'product-view';
export const pathProductEdit = 'product-edit';

class IDPartsProduct extends IDParts {
    readonly uq: Uq;
    readonly caption: string;

    // IDList
    readonly ViewItem: (value: any) => JSX.Element;
    readonly query: UqQuery<any, any>;
    readonly listTop?: JSX.Element;

    // IDNew
    readonly ID: UqID<any>;
    readonly formRows: FormRow[];
    readonly onNo: (no: string) => void;
    readonly actSave: (no: string, data: any) => Promise<any>;

    // IDSelect
    readonly placeholder?: string;
    // readonly onItemClick: (item: any) => Promise<void>;
    readonly autoLoadOnOpen?: boolean;

    // IDView
    readonly viewRows: IDViewRowProps[];

    constructor(uqApp: UqApp) {
        super(uqApp);
        let uq = uqApp.uqs.JsTicket;
        this.uq = uq;

        this.caption = '产品';
        this.ViewItem = ViewProduct;
        this.query = uq.SearchProduct;
        this.listTop = <ListTop />;

        this.ID = uq.Product;

        const rowNO: FormInput = { name: 'no', label: '编号', type: 'text', options: { maxLength: 20, disabled: true } };
        this.formRows = [
            rowNO,
            { name: 'name', label: '名称', type: 'text', options: { maxLength: 50 } },
            { type: 'submit' },
        ];
        this.onNo = (no: string) => {
            rowNO.options.value = no;
        }
        this.actSave = async (no: string, data: any) => {
            const { name } = data;
            let ret = await uq.SaveProduct.submit({ pNo: no, name });
            return ret;
        }

        this.placeholder = '产品编号名称';
        this.autoLoadOnOpen = true;

        this.viewRows = [
            { name: 'id', label: 'id', readonly: true },
            { name: 'no', label: '编号', readonly: true },
            { name: 'name', label: '名称' },
        ];
    }
}

export function ViewProduct({ value: { no, name } }: { value: Product }) {
    return <div className="d-block">
        <div className='small text-muted'>{no}</div>
        <div><b>{name}</b></div>
    </div>;
}

function PageProductNew() {
    return <PageIDNew Parts={IDPartsProduct} />;
}

function PageProductView() {
    return <PageIDView Parts={IDPartsProduct} />;
}

function PageProductList() {
    return <PageIDList Parts={IDPartsProduct} />
}

export function PageProductSelect({ onItemClick }: { onItemClick: (item: any) => Promise<void> }) {
    return <PageIDSelect Parts={IDPartsProduct} onItemClick={onItemClick} />;
}

function ListTop() {
    const uqApp = useUqApp();
    const { JsTicket } = uqApp.uqs;
    async function onClick() {
        let ret = await JsTicket.Sp.submit({});
        alert('click ok');
    }
    return <div>
        <button className='btn btn-outline-primary' onClick={onClick}>test auto reload entities</button>
    </div>;
}

export const routeProduct = <>
    <Route path={pathProductNew} element={<PageProductNew />} />
    <Route path={pathProductList} element={<PageProductList />} />
    <Route path={`${pathProductView}/:id`} element={<PageProductView />} />
</>;
