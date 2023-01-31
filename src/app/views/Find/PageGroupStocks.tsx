import { useUqApp } from "app/MyUqApp";
import { Page } from "tonwa-com";
import { ViewStockList } from "./ViewStockList";

export function PageGroupStock() {
    const uqApp = useUqApp();
    const { group } = uqApp.storeApp;
    return <Page header={group.name}>
        <ViewStockList stocks={group.stocks} />
    </Page>;
}
