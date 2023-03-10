import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { LinkModal } from "tonwa-app";
import { PartsProps } from "../Parts";
import { SheetParts } from "./SheetParts";

export function PageSheetList({ Parts }: PartsProps<SheetParts>) {
    const uqApp = useUqApp();
    const parts = uqApp.fromCache(Parts);
    const { uq, ModalSheetEdit, PageSheetNew, caption, ViewItemSheet, IxMySheet } = parts;
    async function query(param: any, pageStart: any, pageSize: number): Promise<any[]> {
        let ret = await uq.IX({
            IX: IxMySheet,
            ix: undefined,
            page: { start: pageStart, size: pageSize },
            order: 'desc',
        });
        return ret;
    }
    function ViewItem({ value }: { value: any }) {
        const { xi } = value;
        /*
        function ViewSheetPurchase({ value }: { value: any }) {
            const { no, vendor } = value;
            return <div>
                <small className="text-muted">{caption}</small> <b>{no}</b> &nbsp;
                <IDView id={vendor} uq={uq} Template={ViewContact} />
            </div>
        }

        function ViewSheet({ value }: { value: any }) {
            const { $entity } = value;
            switch ($entity) {
                default:
                    return <div>unknow entity: {$entity}</div>;
                case IDSheet.name:
                    return <ViewSheetPurchase value={value} />
            }
        }
        // ={`../${pathSheetEdit}/${xi}`}>
        */
        return <LinkModal modal={<ModalSheetEdit id={xi} />}>
            <div className="px-3 py-2">
                <ViewItemSheet id={xi} />
            </div>
        </LinkModal>
    }
    return <PageQueryMore header={caption + '录入'}
        param={{}}
        sortField={'xi'}
        query={query}
        pageSize={15}
        pageMoreSize={5}
        ViewItem={ViewItem}
    >
        <div className="px-3 py-2 border-bottom">
            <LinkModal className="btn btn-primary" tag="button" modal={<PageSheetNew />}>
                新建{caption}
            </LinkModal>
        </div>
    </PageQueryMore>;
}
