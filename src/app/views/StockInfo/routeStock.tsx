import { useUqApp } from "app/MyUqApp";
import { StoreStockInfo } from "app/stores";
import { useQuery } from "react-query";
import { Outlet, Route, useParams } from "react-router-dom";
import { PageBonusDetail } from "./PageBonusDetail";
import { PageProfitDetail } from "./PageProfitDetail";
import { PageStockInfo } from "./PageStockInfo";

export function pathStockInfo(id: string | number): string {
    return `/stock/${id}`;
}

export const pathBonusDetail = `bonus`;
export const pathProfitDetail = `profit`;

export const routeStock = <Route path={pathStockInfo(':id')} element={<LayoutStockInfo />}>
    <Route index element={<PageStockInfo />} />
    <Route path={pathBonusDetail} element={<PageBonusDetail />} />
    <Route path={pathProfitDetail} element={<PageProfitDetail />} />
</Route>;

function LayoutStockInfo() {
    const uqApp = useUqApp();
    const { id } = useParams();
    const { data: storeStockInfo } = useQuery('stockinfo', async function () {
        let ret = new StoreStockInfo(uqApp, Number(id));
        await ret.init();
        return ret;
    });
    return <Outlet context={storeStockInfo} />;
}
