import { PageQueryMore } from "app/coms";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FA, LMR, SearchBox } from "tonwa-com";
import { SheetParts } from "./SheetParts";

export function PageSheetNew({ parts }: { parts: SheetParts }) {
    const { uq, pathSheetEdit, IDSheet, IxMySheet, QuerySearchSheetItem } = parts;
    const navigate = useNavigate();
    const [searchParam, setSearchParam] = useState({ key: undefined as string });
    const right = <SearchBox className="px-3 py-2" onSearch={onSearch} placeholder="往来单位" />;
    async function onSearch(key: string) {
        setSearchParam({
            key
        });
    }
    function ItemView({ value }: { value: any }) {
        return <LMR className="px-3 py-2 align-items-center">
            <FA name="angle-right" className="me-3" />
            <span>{JSON.stringify(value)}</span>
            <span />
        </LMR>;
    }
    const query = QuerySearchSheetItem; //JsTicket.SearchContact;
    async function onItemClick(item: any) {
        let no = await uq.IDNO({ ID: IDSheet });
        let [id] = await uq.ActIX({
            IX: IxMySheet,
            ID: IDSheet,
            values: [{
                ix: undefined,
                xi: {
                    no, vendor: item.id
                }
            }]
        });
        navigate(`../${pathSheetEdit}/${id}`, { replace: true });
    }
    return <PageQueryMore header="开始"
        query={query}
        param={searchParam}
        sortField="id"
        ItemView={ItemView}
        onItemClick={onItemClick}
        pageSize={4}
        pageMoreSize={1}
    >
        {right}
    </PageQueryMore>;
}
