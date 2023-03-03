import { FormInput, FormRow } from "app/coms";
import { PageIDEdit, PageIDList, PageIDNew, PageIDView, RowProps } from "app/templet/ID";
import { useUqApp } from "app/UqApp";
import { Link, Route } from "react-router-dom";
import { Contact } from "uqs/JsTicket";

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
    const rows: RowProps[] = [
        { name: 'id', label: 'id', readonly: true },
        { name: 'no', label: '编号', readonly: true },
        { name: 'name', label: '名称' },
    ];
    return <PageIDView header={IDCaption}
        ID={JsTicket.Contact}
        rows={rows}
    />;
}

function PageEdit() {
    return <PageIDEdit header={`编辑${IDCaption}`} />;
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

export const pathContactNew = 'Contact-new';
export const pathContactList = 'Contact-list';
export const pathContactView = 'Contact-view';
export const pathContactEdit = 'Contact-edit';
export const routeContact = <>
    <Route path={pathContactNew} element={<PageNew />} />
    <Route path={pathContactList} element={<PageList />} />
    <Route path={`${pathContactView}/:id`} element={<PageView />} />
    <Route path={`${pathContactEdit}/:id`} element={<PageEdit />} />
</>;
