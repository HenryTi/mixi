import { PageQueryMore, ViceTitle } from "app/coms";
import { Parts, SheetParts } from "app/template";
import { useUqApp } from "app/UqApp";
import { Link, Route } from "react-router-dom";
import { IDView, LinkModal } from "tonwa-app";
import { SheetPartsPurchase } from "./SheetPurchase";
import { SheetPartsStoreIn } from "./StoreIn";

export const pathSheetCenter = 'sheet-center';
export function PageSheetCenter() {
    const uqApp = useUqApp();
    const { JsTicket: uq } = uqApp.uqs;
    const { IxMySheet } = uq;
    const partsColl: { [entity: string]: SheetParts } = {};
    const partsArr = [SheetPartsPurchase, SheetPartsStoreIn].map(v => {
        const parts = uqApp.fromCache(v);
        const { name } = parts;
        partsColl[name] = parts;
        return parts;
    });
    async function query(param: any, pageStart: any, pageSize: number): Promise<any[]> {
        let ret = await uq.IX({
            IX: IxMySheet,
            ix: undefined,
            page: { start: pageStart, size: pageSize },
            order: 'desc',
        });
        return ret;
    }
    function TemplateSheetItem({ value }: { value: any }) {
        let { id, $entity } = value;
        let parts = partsColl[$entity];
        if (parts === undefined) {
            return <div>{JSON.stringify(value)}</div>;
        }
        let { ViewItemSheet, pathEdit } = parts;
        return <Link to={`../${pathEdit}/${id}`}>
            <div className="px-3 py-2">
                <ViewItemSheet id={id} />
            </div>
        </Link>;
    }
    function ViewItem({ value }: { value: any }) {
        const { xi } = value;
        return <IDView uq={uq} id={xi} Template={TemplateSheetItem} />;
        /*
        return <LinkModal modal={<PageSheetEdit id={xi} />}>
            <div className="px-3 py-2">
                <ViewItemSheet id={xi} />
            </div>
        </LinkModal>
        */
    }
    function Top({ items }: { items: any[] }) {
        if (!items) return null;
        if (items.length === 0) return null;
        return <ViceTitle>录入中的单据</ViceTitle>;
    }
    return <PageQueryMore header={'单据中心'}
        param={{}}
        sortField={'xi'}
        query={query}
        pageSize={15}
        pageMoreSize={5}
        ViewItem={ViewItem}
        Top={Top}
    >
        <div className="px-3 py-2 border-bottom d-flex flex-wrap p-2">
            {partsArr.map((v, index) => {
                let { caption, pathNew } = v;
                return <Link key={index}
                    to={`../${pathNew}`}
                    className="px-3 px-2 btn btn-outline-primary m-2"
                >
                    {caption}
                </Link>
            })}
        </div>
    </PageQueryMore>;
}

export const routeSheetCenter = <Route path={pathSheetCenter} element={<PageSheetCenter />} />;