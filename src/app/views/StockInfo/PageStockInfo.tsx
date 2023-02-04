import { Page } from "tonwa-com";
import { StoreStockInfo } from "app/stores";
import { ViewBaseInfo } from "./ViewBaseInfo";
import { ViewChartBonus } from "./ViewChartBonus";
import { ViewMiRatesChart } from "./ViewMiRatesChart";
import { ViewMivaluesChart } from "./ViewMiValuesChart";
import { ViewPredictInfo } from "./ViewProdictInfo";
import { ViewProfitChart } from "./ViewProfitChart";
import { Link, useOutletContext } from "react-router-dom";
import { pathBonusDetail } from "./routeStock";

export function PageStockInfo() {
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
