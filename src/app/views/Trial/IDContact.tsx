import { FormInput, FormRow } from "app/coms";
import { PageIDList, PageIDNew, PageIDView, IDViewRowProps, IDParts, PageIDSelect } from "app/template/ID";
import { UqApp, useUqApp } from "app/UqApp";
import { Link, Route } from "react-router-dom";
import { Uq, UqID, UqQuery } from "tonwa-uq";
import { Contact } from "uqs/JsTicket";

export const pathContactNew = 'Contact-new';
export const pathContactList = 'Contact-list';
export const pathContactView = 'Contact-view';
export const pathContactEdit = 'Contact-edit';

class IDPartsContact extends IDParts {
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
    readonly onItemClick: (item: any) => Promise<void>;
    readonly autoLoadOnOpen?: boolean;

    // IDView
    readonly viewRows: IDViewRowProps[];

    constructor(uqApp: UqApp) {
        super(uqApp);
        let uq = uqApp.uqs.JsTicket;
        this.uq = uq;

        this.caption = '往来单位';
        this.ViewItem = function ({ value: { id, no, name } }: { value: Contact }) {
            // to={`../${pathContactView}/${id}`}
            return <div className="d-block px-3 py-2">
                <div className='small text-secondary'>{id}</div>
                <div>{no} {name}</div>
            </div>;
        }
        this.query = uq.SearchContact;
        this.listTop = <ListTop />;

        this.ID = uq.Contact;

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
            let ret = await uq.SaveContact.submit({ pNo: no, name });
            return ret;
        }

        this.placeholder = `${this.caption}编号名称`;
        this.autoLoadOnOpen = true;

        this.viewRows = [
            { name: 'id', label: 'id', readonly: true },
            { name: 'no', label: '编号', readonly: true },
            { name: 'name', label: '名称' },
        ];
    }
}

function PageContactNew() {
    return <PageIDNew Parts={IDPartsContact} />;
}

function PageContactView() {
    return <PageIDView Parts={IDPartsContact} />;
}

function PageContactList() {
    return <PageIDList Parts={IDPartsContact} />
}

export function PageContactSelect({ onItemClick }: { onItemClick: (item: any) => Promise<void> }) {
    return <PageIDSelect Parts={IDPartsContact} onItemClick={onItemClick} />;
}

/*
const IDCaption = '往来单位';
function PageNew() {
    const uqApp = useUqApp();
    const { JsTicket } = uqApp.uqs;
    const rowNO: FormInput = { name: 'no', label: '编号', type: 'text', options: { maxLength: 20, disabled: true } };
    const formRows: FormRow[] = [
        rowNO,
        { name: 'name', label: '名称', type: 'text', options: { maxLength: 50 } },
        { type: 'submit' },
    ];
    async function actSave(no: string, data: any) {
        const { name } = data;
        let ret = await JsTicket.SaveContact.submit({ pNo: no, name });
        return ret;
    }
    function onNo(no: string) {
        rowNO.options.value = no;
    }
    return <PageIDNew header={`新建${IDCaption}`}
        ID={JsTicket.Contact}
        formRows={formRows}
        onNo={onNo}
        actSave={actSave}
    />;
}

function PageView() {
    const uqApp = useUqApp();
    const { JsTicket } = uqApp.uqs;
    const rows: IDViewRowProps[] = [
        { name: 'id', label: 'id', readonly: true },
        { name: 'no', label: '编号', readonly: true },
        { name: 'name', label: '名称' },
    ];
    return <PageIDView header={IDCaption}
        ID={JsTicket.Contact}
        rows={rows}
    />;
}

export function PageList() {
    const uqApp = useUqApp();
    const { JsTicket } = uqApp.uqs;
    function ItemView({ value: { id, no, name } }: { value: Contact }) {
        return <Link className="d-block px-3 py-2" to={`../${pathContactView}/${id}`}>
            <div className='small text-secondary'>{id}</div>
            <div>{no} {name}</div>
        </Link>;
    }
    return <PageIDList header={`${IDCaption}列表`}
        ItemView={ItemView}
        query={JsTicket.SearchContact}
        listTop={<ListTop />}
    />
}
*/

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

export const routeContact = <>
    <Route path={pathContactNew} element={<PageContactNew />} />
    <Route path={pathContactList} element={<PageContactList />} />
    <Route path={`${pathContactView}/:id`} element={<PageContactView />} />
</>;
