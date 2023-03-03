import { PageIDSelect } from "app/templet/ID/PageIDSelect";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Page, useModal } from "tonwa-app";
import { List } from "tonwa-com";
import { PageProductSelect } from "../Product";

export function PageSheetMain() {
    const { state: locationState } = useLocation();
    const [items, setItems] = useState([] as any[]);
    const button = <div className="px-3 py-2">
        <button className="btn btn-primary" onClick={onAddDetail}>增加明细</button>
    </div>;
    const { openModal, closeModal } = useModal();
    function onAddDetail() {
        openModal(<PageProductSelect onItemClick={onItemSelect} />);
    }
    async function onItemSelect(item: any) {
        closeModal();
    }
    function ItemView({ value }: { value: any; }) {
        return <div className="px-3 py-2">{JSON.stringify(value)}</div>;
    }
    return <Page header="单据">
        <div className="px-3 py-2"><b>往来单位：</b>{JSON.stringify(locationState)}</div>
        {items.length > 6 && button}
        <List items={items} ItemView={ItemView} none={<div className="small text-muted px-3 py-2">无明细</div>} />
        {button}
    </Page>;
}
