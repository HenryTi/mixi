import { MiAccount } from "app/stores/MiAccount";
import { useAtomValue } from "jotai";
import { Link } from "react-router-dom";
import { useModal } from "tonwa-app";
import { DropdownAction, DropdownActions, FA } from "tonwa-com";
import { ModalCashIn } from "./FormAccount";
import { pathCashAdjust, pathCashInit, pathCashOut } from "./routeAccount";

export function ButtonCashActs({ miAccount }: { miAccount: MiAccount }) {
    const { openModal } = useModal();
    const { cash } = useAtomValue(miAccount.accountValue);
    let actions: DropdownAction[] = [
        { caption: '调入资金', action: showCashIn, icon: 'sign-in' },
        { caption: '调出资金', action: pathCashOut, icon: 'sign-out' },
        { caption: '调整资金', action: pathCashAdjust, icon: 'adjust' },
    ];
    if (typeof cash === 'number') {
        return <DropdownActions className="btn btn-outline-warning"
            containerClass="ms-auto"
            actions={actions} icon="money" content="资金" />
    }
    function showCashIn(item: DropdownAction) {
        openModal(<ModalCashIn miAccount={miAccount} />); //, item.caption);
    }
    return <Link className="btn btn-outline-info ms-auto" to={pathCashInit}>
        <FA name="cog" className="small text-info" /> 初始资金
    </Link>;
}