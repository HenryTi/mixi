import { Page } from "tonwa-com";
import { useInitPageStore } from "tonwa-uq-com";
import { Stock, StockValue } from "uqs/BrMi";
import { StoreStockInfo } from "app/stores";
import { ViewBaseInfo } from "./ViewBaseInfo";
import { ViewChartBonus } from "./ViewChartBonus";
import { ViewMiRatesChart } from "./ViewMiRatesChart";
import { ViewMivaluesChart } from "./ViewMiValuesChart";
import { ViewPredictInfo } from "./ViewProdictInfo";
import { ViewProfitChart } from "./ViewProfitChart";
import { useUqApp } from "app/MyUqApp";

export function PageStockInfo({ stock }: { stock: Stock & StockValue }) {
    let uqApp = useUqApp();
    const { storeApp } = uqApp;
    const { state } = storeApp;
    const { trackDay } = state;
    const storeStockInfo = useInitPageStore(() => new StoreStockInfo(stock, trackDay));
    const { baseItem } = storeStockInfo;
    const { name, code, day } = baseItem;

    let headStr = name + ' ' + code;
    if (day !== undefined) {
        headStr += ' - ' + day;
    }
    function showBonus() {
        alert('this.controller.showBonus()');
    }
    return <Page header={headStr} headerClassName='bg-primary'>
        <ViewBaseInfo />
        <ViewMiRatesChart />
        <ViewMivaluesChart />
        <div className="px-3 py-1 bg-white cursor-pointer text-primary" onClick={showBonus} >分红信息&gt;&gt;</div>
        <ViewChartBonus />
        <ViewPredictInfo />
        <ViewProfitChart />
    </Page>;
}
