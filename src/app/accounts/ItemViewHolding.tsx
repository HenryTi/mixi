import { NFormat, nFormat0, nFormat1, nFormat2, smallPercent } from "app/coms/ItemViewStock";
import { HoldingStock } from "app/stores";
import { useRef, useState } from "react";
import { FA } from "tonwa-com";
import { useSnapshot } from "valtio";

export function ItemViewHolding({ value }: { value: HoldingStock }) {
    let [visible, setVisible] = useState(false);
    let refDivAct = useRef<HTMLDivElement>();
    let { miAccount, stockObj, quantity, market, cost } = value;
    let { portionAmount, cash } = useSnapshot(miAccount.state);
    let { name, no } = stockObj;
    let profit: number, profitRate: number, costPrice: number;
    if (quantity < 1) { // = 0
        profit = -cost;
        if (profit >= -0.01 && profit <= 0.01) profit = 0;
        profitRate = 0;
        costPrice = 0;
    }
    else {
        profit = market - cost;
        profitRate = cost < 0.1 ? 999 : profit * 100 / cost;
        costPrice = cost / quantity;
    }
    if (profit >= -0.01 && profit <= 0.01) {
        profit = 0;
        profitRate = 0;
    }
    function showHolding() {

    }
    function showBuy() {

    }
    function showSell() {

    }
    function showChangeCost() {

    }
    function showTransactionDetail() {

    }

    function onClick() {
        let vis: boolean = !visible;
        setVisible(vis);
        if (vis === true) {
            setTimeout(() => {
                refDivAct.current.scrollIntoView(false);
            }, 100);
        }
    }
    let { miRate, price } = stockObj;
    let cn: string;
    if (profit < 0) {
        cn = 'text-success';
    }
    else if (profit > 0) {
        cn = 'text-danger';
    }
    else {
        cn = '';
    }
    let vBuyable: any;
    if (cash) {
        let buyable: number = (portionAmount - market) / price;
        let neg: boolean = false;
        if (buyable < 0) {
            neg = true;
            buyable = -buyable;
        }
        if (buyable < 10) {
            buyable = Math.round(buyable);
        }
        else if (buyable < 100) {
            buyable = Math.round(buyable / 10) * 10;
        }
        else {
            buyable = Math.round(buyable / 100) * 100;
        }
        if (market < portionAmount * 0.9) {
            if (quantity > 0) {
                if (neg === false) {
                    vBuyable = <span className="text-warning">{buyable} <FA name="plus-square-o" /></span>;
                }
            }
        }
        else if (market > portionAmount * 1.1) {
            if (neg === true) {
                vBuyable = <span className="text-muted">{buyable} <FA name="minus-square-o" /></span>;
            }
        }
        else {
            vBuyable = <FA name="check-circle-o" className="text-warning" />;
        }
    }

    function fString(v: number, nFormat: NFormat, suffix: string | JSX.Element = ''): string | JSX.Element {
        if (v === null || v === undefined || isNaN(v) === true) return '-';
        return <>{v.toLocaleString(undefined, nFormat)}{suffix}</>;
    }

    return <div className="d-block px-2 px-sm-3 py-1 container">
        <div className={'row mx-0 cursor-pointer ' + cn} onClick={onClick}>
            <div className="col-3 px-0">
                <div>{name}</div>
                <div>{no}</div>
            </div>
            <div className="col px-0 text-end">
                <div>{fString(quantity, nFormat0)}</div>
                <div className="small">{fString(market, nFormat1)}</div>
            </div>
            <div className="col px-0 text-end">{fString(miRate, nFormat1, smallPercent)}</div>
            <div className="col px-0 text-end">
                <div className="">{fString(price, nFormat2)}</div>
                <div className="small">{fString(costPrice, nFormat2)}</div>
            </div>
            <div className="col px-0 text-end">
                <div className="">{fString(profitRate, nFormat1, smallPercent)}</div>
                <div className="small">{fString(profit, nFormat1)}</div>
            </div>
        </div>
        <div className={visible === true ? '' : 'd-none'}>
            <div className="row mt-2 mx-0 pt-2 pb-1 align-items-center">
                <div className="col-sm-3 col-auto px-0">
                    <button className="btn btn-sm btn-outline-info me-1 me-sm-3 "
                        onClick={showBuy}>买入</button>
                    <button className="btn btn-sm btn-outline-info me-1 me-sm-3 "
                        onClick={showSell}>卖出</button>
                </div>
                <div className="col-sm col-auto px-0 text-end ms-auto ">{vBuyable}</div>
                <div className="col-sm col-auto px-0 text-end ms-sm-0 ms-3">
                    <button className="btn btn-sm btn-link"
                        onClick={showHolding}>分析</button>
                </div>
                <div className="col-sm col-auto px-0 text-end">
                    <button className="btn btn-sm btn-link"
                        onClick={showChangeCost}>改成本</button>
                </div>
                <div className="col-sm col-auto px-0 text-end">
                    <button className="btn btn-sm btn-link"
                        onClick={showTransactionDetail}>明细</button>
                </div>
            </div>
            <div ref={refDivAct} style={{ height: "1px" }}></div>
        </div>
    </div>;
}
