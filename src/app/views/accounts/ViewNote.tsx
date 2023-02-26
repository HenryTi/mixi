import { MiAccount } from "app/stores/MiAccount";
import { useAtomValue } from "jotai";

export function ViewNote({ account }: { account: MiAccount }) {
    let { cash, portionAmount, portion, buyableCount } = useAtomValue(account.accountValue);
    let lis = (cash && portionAmount) ?
        <>
            <li>
                <small className="">份数:</small> {portion} &nbsp;
                <small className="">份额:</small> <span className="text-danger">{portionAmount}</span> &nbsp;
                {
                    buyableCount > 0 ?
                        <><small className="">可加</small>{buyableCount}只</>
                        :
                        <span className="text-danger"> &nbsp; 已超{-buyableCount}只</span>
                }
            </li>
            <li className="">
                <small className="text-info">保持分散，单只股票不超资金份额</small>
            </li>
        </>
        :
        <li className="">设置资金后，会根据分散要求，提供股数建议</li>;
    return <ul className="small text-muted mb-0">{lis}</ul>;
}
