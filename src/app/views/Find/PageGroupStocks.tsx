import { useUqApp } from "app/MyUqApp";
import { useQuery } from "react-query";
import { Page } from "tonwa-com";
import { ViewStockList } from "./ViewStockList";

export function PageGroupStock() {
    const uqApp = useUqApp();
    const { group } = uqApp.storeApp;
    const { } = useQuery('PageGroupStock', async () => { await group.loadItems(); });
    return <Page header={group.name}>
        <ViewStockList stocks={group.stocks} />
    </Page>;
}
