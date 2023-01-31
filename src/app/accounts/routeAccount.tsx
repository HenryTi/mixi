import { useUqApp } from "app/MyUqApp";
import { Outlet, Route, useParams } from "react-router-dom";
import { PageAccountBuy } from "./ButtonBuy";
import { PageAccountIndex } from "./PageAccountIndex";
import { PageCashAdjust, PageCashIn, PageCashInit, PageCashOut } from "./FormAccount";

export function pathAccount(id: string | number) { return `/account/${id}` };
export const pathAccountBuy = 'buy';
export const pathCashInit = 'cashInit';
export const pathCashIn = 'cashIn';
export const pathCashOut = 'cashOut';
export const pathCashAdjust = 'cashAdjust';

export const routeAccount = <>
    <Route path={pathAccount(':id')} element={<LayoutAccount />}>
        <Route index element={<PageAccountIndex />} />
        <Route path={pathAccountBuy} element={<PageAccountBuy />} />
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
    return <div>
        <Outlet context={miAccount} />
    </div>;
}
