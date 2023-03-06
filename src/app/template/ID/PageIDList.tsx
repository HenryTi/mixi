import { useUqApp } from 'app/UqApp';
import { PageQueryMore } from '../../coms';
import { PartsProps } from '../Parts';
import { IDParts } from './IDParts';

/*
interface PageIDListProps {
    header: string;
    ItemView: (value: any) => JSX.Element;
    query: UqQuery<any, any>;
    listTop?: JSX.Element;
}
*/
export function PageIDList({ Parts }: PartsProps<IDParts>) {
    const uqApp = useUqApp();
    const { caption, ViewItem, query, listTop } = uqApp.fromCache(Parts);
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
    return <PageQueryMore header={`${caption}列表`}
        query={query}
        param={searchParam}
        sortField="id"
        ViewItem={ViewItem}
        pageSize={4}
        pageMoreSize={1}
    >
        {listTop}
    </PageQueryMore>;
}
