import { Page, usePromise, usePromiseResult } from "tonwa-com";
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
import { useAsyncValue, useParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { useQuery } from "react-query";

let cache = new Map();
let id = 1;
function fetchData(url: string): Promise<any> {
    if (!cache.has(url)) {
        let v = getData(url);
        (v as any).id = id++;
        cache.set(url, v);
        return v;
    }
    let ret = cache.get(url);
    return ret;
}

async function getData(url: string) {
    return await getLoad();
}

async function getLoad() {
    await new Promise(resolve => {
        setTimeout(resolve, 100);
    });
    return 'ok';
}

export function PageStockInfo2() {
    let a = fetchData('a');
    const ret = usePromise(a);

    return <div>
        stock: {ret}
    </div>
}

export function PageStockInfo() {
    //{ stock }: { stock: Stock & StockValue };
    const uqApp = useUqApp();
    const { storeApp } = uqApp;
    const { state } = storeApp;
    const { trackDay } = state;
    const { id } = useParams();
    const { stock } = storeApp;
    const { data: storeStockInfo } = useQuery('stockinfo', async function () {
        let ret = new StoreStockInfo(stock, trackDay);
        ret.setUqAppAndParent(uqApp, undefined);
        await ret.initOnce();
        return ret;
    });
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
        <ViewBaseInfo storeStockInfo={storeStockInfo} />
        <ViewMiRatesChart storeStockInfo={storeStockInfo} />
        <ViewMivaluesChart storeStockInfo={storeStockInfo} />
        <div className="px-3 py-1 bg-white cursor-pointer text-primary" onClick={showBonus} >分红信息&gt;&gt;</div>
        <ViewChartBonus storeStockInfo={storeStockInfo} />
        <ViewPredictInfo storeStockInfo={storeStockInfo} />
        <ViewProfitChart storeStockInfo={storeStockInfo} />
    </Page>;
}
