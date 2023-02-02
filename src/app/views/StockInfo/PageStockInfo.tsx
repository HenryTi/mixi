import { Page, usePromise, usePromiseResult } from "tonwa-com";
import { StoreStockInfo } from "app/stores";
import { ViewBaseInfo } from "./ViewBaseInfo";
import { ViewChartBonus } from "./ViewChartBonus";
import { ViewMiRatesChart } from "./ViewMiRatesChart";
import { ViewMivaluesChart } from "./ViewMiValuesChart";
import { ViewPredictInfo } from "./ViewProdictInfo";
import { ViewProfitChart } from "./ViewProfitChart";
import { Link, useOutletContext } from "react-router-dom";
import { pathBonusDetail } from "./routeStock";

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
    // const uqApp = useUqApp();
    // const { storeApp } = uqApp;
    // const { state } = storeApp;
    // const { trackDay } = state;
    // const { id } = useParams();
    const storeStockInfo = useOutletContext<StoreStockInfo>();
    const { baseItem } = storeStockInfo;
    const { name, code, day } = baseItem;

    let headStr = name + ' ' + code;
    if (day !== undefined) {
        headStr += ' - ' + day;
    }
    return <Page header={headStr} headerClassName='bg-primary'>
        <ViewBaseInfo />
        <ViewMiRatesChart />
        <ViewMivaluesChart />
        <Link className="px-3 mt-3 py-2 tonwa-bg-gray-2 border-bottom"
            to={pathBonusDetail}>分红信息&gt;&gt;</Link>
        <ViewChartBonus />
        <ViewPredictInfo />
        <ViewProfitChart />
    </Page>;
}
