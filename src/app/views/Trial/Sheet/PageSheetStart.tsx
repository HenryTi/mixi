import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FA, LMR, SearchBox } from "tonwa-com";
import { pathSheetMain } from "./routeSheet";

export function PageSheetStart() {
    const uqApp = useUqApp();
    const { JsTicket } = uqApp.uqs;
    const navigate = useNavigate();
    const [searchParam, setSearchParam] = useState({ key: undefined as string });
    const right = <SearchBox onSearch={onSearch} placeholder="往来单位" />;
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
    const query = JsTicket.SearchContact;
    async function onItemClick(item: any) {
        navigate(`../${pathSheetMain}`, { state: item, replace: true });
    }
    return <PageQueryMore header="开始" right={right}
        query={query}
        param={searchParam}
        sortField="id"
        ItemView={ItemView}
        onItemClick={onItemClick}
        pageSize={4}
        pageMoreSize={1}
    >
    </PageQueryMore>;
}
