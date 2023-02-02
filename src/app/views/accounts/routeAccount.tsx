import { useUqApp } from "app/MyUqApp";
import { Outlet, Route, useParams } from "react-router-dom";
import { PageAccount } from "./PageAccount";
import { PageCashAdjust, PageCashIn, PageCashInit, PageCashOut, PageStockBuy, PageStockSell } from "./FormAccount";

export function pathAccount(id: string | number) { return `/account/${id}` };
export const pathStockBuy = 'buy';
export const pathStockSell = 'sell';
export const pathCashInit = 'cashInit';
export const pathCashIn = 'cashIn';
export const pathCashOut = 'cashOut';
export const pathCashAdjust = 'cashAdjust';

export const routeAccount = <>
    <Route path={pathAccount(':id')} element={<LayoutAccount />}>
        <Route index element={<PageAccount />} />
        <Route path={pathStockBuy} element={<PageStockBuy />} />
        <Route path={pathStockSell} element={<PageStockSell />} />
        <Route path={pathCashInit} element={<PageCashInit />} />
        <Route path={pathCashIn} element={<PageCashIn />} />
        <Route path={pathCashOut} element={<PageCashOut />} />
        <Route path={pathCashAdjust} element={<PageCashAdjust />} />
    </Route>
</>;

function LayoutAccount() {
    const { storeApp } = useUqApp();
    const { id } = useParams();
    let miAccount = storeApp.miAccounts.accountFromId(Number(id));
    return <Outlet context={miAccount} />;
}
