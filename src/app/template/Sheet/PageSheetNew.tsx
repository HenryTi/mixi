import { PageQueryMore } from "app/coms";
import { UqApp, useUqApp } from "app/UqApp";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useModal } from "tonwa-app";
import { FA, LMR, SearchBox } from "tonwa-com";
import { PartsProps } from "../Parts";
import { SheetParts } from "./SheetParts";

export function PageSheetNew({ Parts }: PartsProps<SheetParts>) {
    const uqApp = useUqApp();
    const parts = uqApp.fromCache(Parts);
    const { uq, PageSheetEdit, IDSheet, IxMySheet, QuerySearchSheetItem } = parts;
    const { openModal, closeModal } = useModal();
    // const navigate = useNavigate();
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
        closeModal();
        openModal(<PageSheetEdit id={id} />);
        // navigate(`../${pathSheetEdit}/${id}`, { replace: true });
    }
    return <PageQueryMore header="开始"
        query={query}
        param={searchParam}
        sortField="id"
        ViewItem={ItemView}
        onItemClick={onItemClick}
        pageSize={4}
        pageMoreSize={1}
    >
        {right}
    </PageQueryMore>;
}
