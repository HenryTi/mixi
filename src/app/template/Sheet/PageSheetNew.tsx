import { PageMoreCacheData, PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FA, LMR, SearchBox } from "tonwa-com";
import { PartsProps } from "../Parts";
import { SheetParts } from "./SheetParts";

export function PageSheetNew({ Parts }: PartsProps<SheetParts>) {
    const uqApp = useUqApp();
    const parts = uqApp.fromCache(Parts);
    const { uq, caption, pathEdit, IDSheet, IxMySheet, QuerySearchSheetItem } = parts;
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
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            data.addItem({ ix: undefined, xi: id });
        }
        // closeModal();
        // openModal(<ModalSheetEdit id={id} />);
        navigate(`../${pathEdit}/${id}`, { replace: true });
    }
    return <PageQueryMore header={`新建${caption}`}
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
