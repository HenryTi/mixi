import { PageQueryMore } from "app/coms";
import { Link } from "react-router-dom";
import { IDView } from "tonwa-app";
import { SheetParts } from "./SheetParts";

export function PageSheetList({ parts }: { parts: SheetParts }) {
    const { uq, pathSheetEdit, pathSheetNew, caption, IDSheet, IxMySheet } = parts;
    //const { JsTicket } = uqApp.uqs;
    async function query(param: any, pageStart: any, pageSize: number): Promise<any[]> {
        let ret = await uq.IX({
            IX: IxMySheet,
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
                <small className="text-muted">{caption}</small> <b>{no}</b> &nbsp;
                <IDView id={vendor} uq={uq} Template={ContactView} />
            </div>
        }

        function SheetView({ value }: { value: any }) {
            const { $entity } = value;
            switch ($entity) {
                default:
                    return <div>unknow entity: {$entity}</div>;
                case IDSheet.name:
                    return <SheetPurchaseView value={value} />
            }
        }
        return <Link to={`../${pathSheetEdit}/${xi}`}>
            <div className="px-3 py-2">
                <IDView id={xi} uq={uq} Template={SheetView} />
            </div>
        </Link>
    }
    return <PageQueryMore header="单据录入"
        param={{}}
        sortField={'xi'}
        query={query}
        pageSize={15}
        pageMoreSize={5}
        ItemView={ItemView}
    >
        <div className="px-3 py-2 border-bottom">
            <Link className="btn btn-primary" to={`../${pathSheetNew}`}>新建{caption}</Link>
        </div>
    </PageQueryMore>;
}
