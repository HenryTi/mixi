import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useAtomValue } from "jotai";
import { List, LMR } from "tonwa-com";
import { Page } from 'tonwa-app';
import { nFormat1, smallPercent } from "app/coms/ItemViewStock";
import { HoldingStock } from "app/stores/HoldingStock";
import { ItemViewHolding } from "./ItemViewHolding";
import { ButtonCashActs } from "./ButtonCashActs";
import { ViewNote } from "./ViewNote";
import { useUqApp } from "app/UqApp";
import { pathStockBuy } from "./routeAccount";

export function PageAccount() {
    const { id } = useParams();
    const { storeApp } = useUqApp();
    const { data: miAccount } = useQuery('miAccountLoadItems', async function () {
        return await storeApp.loadMiAccountFromId(Number(id));
    });
    function valueToString(value: number, suffix: string | JSX.Element = undefined): JSX.Element {
        if (isNaN(value) === true) return <>-</>;
        return <>{(value ?? 0).toLocaleString(undefined, nFormat1)}{suffix}</>;
    }
    function renderValue(caption: string, content: string | JSX.Element, cn: string = '') {
        return <div className={'my-1 mx-1 mx-sm-2 border rounded w-min-5c px-1 px-sm-2 py-2 ' + cn}>
            <small className="text-muted">{caption}</small>
            <div>{content}</div>
        </div>;
    }
    let renderCash = (value: number) => {
        let caption = '现金';
        if (typeof value === 'number') return renderValue(caption, valueToString(value));
        return <div className="my-1 mx-1 mx-sm-2 border rounded w-min-5c px-1 px-sm-2 py-2">
            <small className="text-muted">{caption}</small>
            <div className="text-danger small mt-1">[无]</div>
        </div>;
    }
    // let { miAccount, showBuy, showCashIn, showCashOut, showCashAdjust } = this.controller;
    let { no, name } = miAccount;
    let miValue = useAtomValue(miAccount.miValue);
    let market = useAtomValue(miAccount.market);
    let cash = useAtomValue(miAccount.cash);
    let holdingStocks = useAtomValue(miAccount.holdingStocks);

    let holdings: HoldingStock[], holdings0: HoldingStock[];
    if (holdingStocks) {
        holdings = [];
        holdings0 = [];
        let len = holdingStocks.length;
        for (let i = 0; i < len; i++) {
            let holding = holdingStocks[i] as HoldingStock;
            if (holding.quantity === 0) holdings0.push(holding);
            else holdings.push(holding);
        }
    }

    return <Page header={name}>
        <div className="pb-3">
            <div className="mb-3 px-3 py-2 bg-white">
                <LMR>
                    <span>{name}</span>
                    <small className="text-muted">组合编号: {no}</small>
                </LMR>
                <div className="my-3 text-center d-flex justify-content-center flex-wrap">
                    {renderValue('米息率', valueToString(miValue * 100 / market, smallPercent))}
                    {renderValue('市值', valueToString(market))}
                    {renderCash(cash)}
                    {renderValue('米息', valueToString(miValue), 'd-none d-sm-block')}
                    {cash > 0 && renderValue('总值', valueToString(market + cash), 'd-none d-sm-block')}
                </div>
                <ViewNote account={miAccount} />
            </div>

            <div className="mb-3 mx-3 d-flex">
                <Link className="btn btn-outline-primary me-3"
                    to={pathStockBuy}>新买入</Link>
                <ButtonCashActs miAccount={miAccount} />
            </div>

            <div className="px-2 px-sm-3 py-1 container">
                <div className="small text-muted row mx-0">
                    <div className="col-3 px-0">持仓市值</div>
                    <div className="col px-0 text-end">持仓</div>
                    <div className="col px-0 text-end">米息率</div>
                    <div className="col px-0 text-end">
                        市价<br />
                        成本
                    </div>
                    <div className="col px-0 text-end">
                        盈亏<br />
                        比例
                    </div>
                </div>
            </div>
            <List items={holdings}
                ItemView={ItemViewHolding} />
            {
                holdings0 && holdings0.length > 0 && <>
                    <div className="small text-muted px-3 py-1 mt-3">空仓</div>
                    <List items={holdings0}
                        ItemView={ItemViewHolding} />
                </>
            }
        </div>
    </Page>;
}
