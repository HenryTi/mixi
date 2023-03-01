import { useUqApp } from 'app/UqApp';
import { Link } from 'react-router-dom';
import { Product } from 'uqs/JsTicket';
import { PageQueryMore } from '../../coms';
import { pathProductView } from './routeTrial';

export function PageProductList() {
    const uqApp = useUqApp();
    const { JsTicket } = uqApp.uqs;
    function ItemViewProduct({ value: { id, no, name } }: { value: Product }) {
        return <Link className="d-block px-3 py-2" to={`../${pathProductView}/${id}`}>
            <div className='small text-secondary'>{id}</div>
            <div>{no} {name}</div>
        </Link>;
    }
    let searchParam = {
        key: undefined as string,
    };
    return <PageQueryMore header={'产品列表'}
        query={JsTicket.SearchProduct}
        param={searchParam}
        sortField="id"
        ItemView={ItemViewProduct}
        pageSize={4}
        pageMoreSize={1}
    >
        <ListTop />
    </PageQueryMore>;
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
