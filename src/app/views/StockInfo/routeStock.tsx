import { Outlet, Route, useParams } from "react-router-dom";
import { StoreStockInfo } from "app/stores";
import { PageBonusDetail } from "./PageBonusDetail";
import { PageProfitDetail } from "./PageProfitDetail";
import { PageStockInfo } from "./PageStockInfo";
import { useMemo } from "react";
import { useUqApp } from "app/UqApp";

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
    let ssi = useMemo(() => new StoreStockInfo(uqApp, Number(id)), [id]);
    return <Outlet context={ssi} />;
}

