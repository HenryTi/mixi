import { FormInput, FormRow } from "app/coms";
import { PageIDEdit, PageIDList, PageIDNew, PageIDView, RowProps } from "app/templet/ID";
import { PageIDSelect } from "app/templet/ID/PageIDSelect";
import { useUqApp } from "app/UqApp";
import { Link, Route } from "react-router-dom";
import { Product } from "uqs/JsTicket";

const IDCaption = '产品';
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
        let ret = await JsTicket.SaveProduct.submit({ pNo: no, name });
        return ret;
    }
    function onNo(no: string) {
        rowNO.options.value = no;
    }
    return <PageIDNew header={`新建${IDCaption}`}
        ID={JsTicket.Product}
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
    return <PageIDView header={`${IDCaption}`}
        ID={JsTicket.Product}
        rows={rows}
    />;
}

function PageEdit() {
    return <PageIDEdit header={`编辑${IDCaption}`} />;
}

function PageList() {
    const uqApp = useUqApp();
    const { JsTicket } = uqApp.uqs;
    function ItemView({ value: { id, no, name } }: { value: Product }) {
        return <Link className="d-block px-3 py-2" to={`../${pathProductView}/${id}`}>
            <div className='small text-secondary'>{id}</div>
            <div>{no} {name}</div>
        </Link>;
    }
    return <PageIDList header={`${IDCaption}列表`}
        ItemView={ItemView}
        query={JsTicket.SearchProduct}
        listTop={<ListTop />}
    />
}

export function PageProductSelect({ onItemClick }: { onItemClick: (item: any) => Promise<void> }) {
    const uqApp = useUqApp();
    const { JsTicket } = uqApp.uqs;
    function ItemView({ value }: { value: any; }) {
        return <div className="px-3 py-2">{JSON.stringify(value)}</div>;
    }
    return <PageIDSelect header="选择产品"
        placeholder="产品编号名称"
        ItemView={ItemView}
        onItemClick={onItemClick}
        query={JsTicket.SearchProduct}
        autoOnOpen={true}
    />;
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

export const pathProductNew = 'product-new';
export const pathProductList = 'product-list';
export const pathProductView = 'product-view';
export const pathProductEdit = 'product-edit';
export const routeProduct = <>
    <Route path={pathProductNew} element={<PageNew />} />
    <Route path={pathProductList} element={<PageList />} />
    <Route path={`${pathProductView}/:id`} element={<PageView />} />
    <Route path={`${pathProductEdit}/:id`} element={<PageEdit />} />
</>;
