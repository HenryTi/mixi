import { ViceTitle } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useState } from "react";
import { IDView, Page } from "tonwa-app";
import { FA, List, LMR, SearchBox } from "tonwa-com";

interface SheetGroup {
    target: number;
    sheets: any[];
}

export function PageSourceSelect({ onSelected }: { onSelected: (sheet: any) => void }) {
    const { uqs } = useUqApp();
    const uq = uqs.JsTicket;
    const [items, setItems] = useState(null as SheetGroup[]);
    async function onSearch(key: string) {
        let ret = await uq.SearchStoreIn.page({ key }, undefined, 1000);
        const groupColl: { [target: number]: SheetGroup } = {};
        for (let v of ret.$page) {
            let { target } = v;
            let group = groupColl[target];
            if (group === undefined) {
                groupColl[target] = group = {
                    target,
                    sheets: []
                };
            }
            group.sheets.push(v);
        }
        setItems(Object.keys(groupColl).map(v => groupColl[Number(v)]));
    }
    function ViewItemGroup({ value }: { value: SheetGroup }) {
        const { target, sheets } = value;
        return <div className="py-2">
            <ViceTitle>
                <IDView uq={uq} id={target} />
            </ViceTitle>
            <List items={sheets} ViewItem={ViewItemSheet} onItemClick={onSelected} />
        </div>
    }
    function ViewItemSheet({ value }: { value: any[] }) {
        return <LMR className="px-3 py-2">
            <span>{JSON.stringify(value)}</span>
            <FA name="angle-right" />
        </LMR>;
    }
    return <Page header="选择单据">
        <SearchBox className="px-3 py-2" onSearch={onSearch} placeholder={'供应商号或名称，或者单据号'} />
        <List items={items} ViewItem={ViewItemGroup} />
    </Page>
}
