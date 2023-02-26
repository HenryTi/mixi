import { useUqApp } from "app/UqApp";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Page, useScrollRestoration } from "tonwa-app";
import { ViewStockList } from "./ViewStockList";

export function PageGroupStock() {
    useScrollRestoration();
    const { storeApp } = useUqApp();
    const { id } = useParams();
    const group = storeApp.groupFromId(id);
    const { } = useQuery('PageGroupStock', async () => { await group.loadItems(); });
    return <Page header={group.name}>
        <ViewStockList stocks={group.stocks} />
    </Page>;
}
