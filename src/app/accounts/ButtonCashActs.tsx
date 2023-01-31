import { MiAccount } from "app/stores/MiAccount";
import { Link } from "react-router-dom";
import { DropdownAction, DropdownActions, FA, useNav } from "tonwa-com";
import { useSnapshot } from "valtio";
import { pathCashAdjust, pathCashIn, pathCashInit, pathCashOut } from "./routeAccount";

export function ButtonCashActs({ miAccount }: { miAccount: MiAccount }) {
    const { cash } = useSnapshot(miAccount.state);
    let actions: DropdownAction[] = [
        { caption: '调入资金', action: pathCashIn, icon: 'sign-in' },
        { caption: '调出资金', action: pathCashOut, icon: 'sign-out' },
        { caption: '调整资金', action: pathCashAdjust, icon: 'adjust' },
    ];
    if (typeof cash === 'number') {
        return <DropdownActions className="btn btn-outline-warning"
            containerClass="ms-auto"
            actions={actions} icon="money" content="资金" />
    }
    return <Link className="btn btn-outline-info ms-auto" to={pathCashInit}>
        <FA name="cog" className="small text-info" /> 初始资金
    </Link>;
}