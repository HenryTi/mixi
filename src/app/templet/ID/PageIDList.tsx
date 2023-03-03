import { UqQuery } from 'tonwa-uq';
import { PageQueryMore } from '../../coms';

interface PageIDListProps {
    header: string;
    ItemView: (value: any) => JSX.Element;
    query: UqQuery<any, any>;
    listTop?: JSX.Element;
}
export function PageIDList({ header, query, ItemView, listTop }: PageIDListProps) {
    // const uqApp = useUqApp();
    //const { JsTicket } = uqApp.uqs;
    /*
    function ItemViewProduct({ value: { id, no, name } }: { value: Product }) {
        return <Link className="d-block px-3 py-2" to={`../${pathView}/${id}`}>
            <div className='small text-secondary'>{id}</div>
            <div>{no} {name}</div>
        </Link>;
    }
    */
    let searchParam = {
        key: undefined as string,
    };
    return <PageQueryMore header={header}
        query={query}
        param={searchParam}
        sortField="id"
        ItemView={ItemView}
        pageSize={4}
        pageMoreSize={1}
    >
        {listTop}
    </PageQueryMore>;
}
