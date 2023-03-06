import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { Link } from "react-router-dom";
import { IDView } from "tonwa-app";
import { pathSheetEdit, pathSheetNew } from "./routeSheet";

export function PageSheetList() {
    const uqApp = useUqApp();
    const { JsTicket } = uqApp.uqs;
    async function query(param: any, pageStart: any, pageSize: number): Promise<any[]> {
        let ret = await JsTicket.IX({
            IX: JsTicket.IxMySheet,
            ix: undefined,
            page: { start: pageStart, size: pageSize },
            order: 'desc',
        });
        return ret;
    }
    function ItemView({ value }: { value: any }) {
        const { xi } = value;
        function ContactView({ value }: { value: any }) {
            const { no, name } = value;
            return <>{name} <small className="text-muted">({no})</small></>
        }
        function SheetPurchaseView({ value }: { value: any }) {
            const { no, vendor } = value;
            return <div>
                <small className="text-muted">采购单</small> <b>{no}</b> &nbsp;
                <IDView id={vendor} uq={JsTicket} Template={ContactView} />
            </div>
        }

        function SheetView({ value }: { value: any }) {
            const { $entity } = value;
            switch ($entity) {
                default:
                    return <div>unknow entity: {$entity}</div>;
                case JsTicket.SheetPurchase.name:
                    return <SheetPurchaseView value={value} />
            }
        }
        return <Link to={`../${pathSheetEdit}/${xi}`}>
            <div className="px-3 py-2">
                <IDView id={xi} uq={JsTicket} Template={SheetView} />
            </div>
        </Link>
    }
    return <PageQueryMore header="单据录入"
        param={{}}
        sortField={'xi'}
        query={query}
        pageSize={15}
        pageMoreSize={5}
        ViewItem={ItemView}
    >
        <div className="px-3 py-2 border-bottom">
            <Link className="btn btn-primary" to={`../${pathSheetNew}`}>新建订单</Link>
        </div>
    </PageQueryMore>;
}
