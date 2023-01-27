import { MiAccount } from "app/stores/MiAccount";
import { DropdownAction, DropdownActions, FA, useNav } from "tonwa-com";
import { useSnapshot } from "valtio";
import { PageCashAdjust, PageCashIn, PageCashInit, PageCashOut } from "./FormAccount";

export function ButtonCashActs({ miAccount }: { miAccount: MiAccount }) {
    const nav = useNav();
    const { cash } = useSnapshot(miAccount.state);

    function showCashIn() {
        nav.open(<PageCashIn miAccount={miAccount} />);
    }
    function showCashOut() {
        nav.open(<PageCashOut miAccount={miAccount} />);
    }
    function showCashAdjust() {
        nav.open(<PageCashAdjust miAccount={miAccount} />);
    }
    function showCashInit() {
        nav.open(<PageCashInit miAccount={miAccount} />);
    }
    let actions: DropdownAction[] = [
        { caption: '调入资金', action: showCashIn, icon: 'sign-in' },
        { caption: '调出资金', action: showCashOut, icon: 'sign-out' },
        { caption: '调整资金', action: showCashAdjust, icon: 'adjust' },
    ];
    if (typeof cash === 'number') {
        return <DropdownActions className="btn btn-outline-warning"
            containerClass="ms-auto"
            actions={actions} icon="money" content="资金" />
    }
    return <button className="btn btn-outline-info ms-auto" onClick={showCashInit}>
        <FA name="cog" className="small text-info" /> 初始资金
    </button>;
}