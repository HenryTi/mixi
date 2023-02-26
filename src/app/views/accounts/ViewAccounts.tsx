import { nFormat1, smallPercent } from "app/coms/ItemViewStock";
import { useUqApp } from "app/UqApp";
import { MiAccount } from "app/stores/MiAccount";
import { FA, List, LMR } from "tonwa-com";
import { pathAccount } from "./routeAccount";
import { useAtomValue } from "jotai";

export function ViewAccounts() {
    const { storeApp } = useUqApp();
    const { miAccounts } = storeApp;

    async function onClickAccount(item: MiAccount) {
        return pathAccount(item.id)
    }

    function ItemViewAccount({ value }: { value: MiAccount }) {
        function valueToString(value: number, suffix?: string | JSX.Element): JSX.Element {
            return <>{(value ?? 0).toLocaleString(undefined, nFormat1)}{suffix}</>
        }
        function renderValue(caption: string, content: JSX.Element, cn: string = '') {
            return <div className={'pr-3 ' + cn}>
                <small className="text-muted">{caption}: </small>
                {content}
            </div>;
        }
        let { name } = value;
        let { miValue, market, count } = useAtomValue(value.accountValue);
        let miRate = market > 1 ? miValue * 100 / market : 0;
        return <LMR>
            <FA name="money" className="text-warning align-self-start mt-3 ms-2 ms-sm-3" size="lg" fixWidth={true} />
            <div className="px-2 px-sm-3 py-2 d-block">
                {
                    count > 0 ?
                        <>
                            <div>
                                {name}
                                <small className="ms-3 text-danger">{count}</small>
                            </div>
                            <div className="mt-2 d-flex">
                                {renderValue('米息率', valueToString(miRate, smallPercent), 'w-min-8c')}
                                {renderValue('米息', valueToString(miValue), 'd-none d-sm-block w-min-8c')}
                                {renderValue('市值', valueToString(market))}
                            </div>
                        </>
                        :
                        <>
                            <div className="py-1">
                                {name}
                            </div>
                        </>
                }
            </div>
            <div className="px-2 d-flex align-items-center">
                <FA className="align-" name="angle-right" />
            </div>
        </LMR>;
    }

    return <>
        <div className="small text-muted pt-2 pb-1 px-3">持仓</div>
        <List items={miAccounts.accounts} ItemView={ItemViewAccount} onItemClick={onClickAccount} />
    </>;

}
