import { atom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { Account, AccountValue, Holding, Portfolio } from "uqs/BrMi";
import { HoldingStock } from "./HoldingStock";
import { holdingMiRateSorter } from "./sorter";
import { StoreApp } from "./StoreApp";

interface AccountProps {
    market: number;
    miValue: number;
    cash: number;
    portion: number;
    count: number;
    portionAmount: number;
    buyableCount: number;
    divident: number;
};

export class MiAccount {
    protected readonly storeApp: StoreApp;
    readonly id: number;
    readonly no: string;
    readonly name: string;

    readonly holdingStocks = atom(null as HoldingStock[]);
    readonly accountValue = atom(undefined as AccountProps);

    constructor(store: StoreApp, account: Account & AccountValue) {
        this.storeApp = store;
        this.id = account.id;
        this.no = account.no;
        this.name = account.name;
        this.setAccountValue(Object.assign({}, account));
    }

    private getAccountValue() {
        return getAtomValue(this.accountValue);
    }

    private setAccountValue(accountValue: Partial<AccountProps>) {
        let org = this.getAccountValue();
        setAtomValue(this.accountValue, Object.assign({}, org, accountValue));
    }

    async loadItems() {
        const holdingStocks = getAtomValue(this.holdingStocks);
        if (holdingStocks) {
            holdingStocks.sort(holdingMiRateSorter);
            return;
        }
        let { yumi } = this.storeApp;
        let ret = await yumi.IX<Holding & Portfolio>({
            IX: yumi.AccountHolding,
            ix: this.id,
            IDX: [yumi.Holding, yumi.Portfolio]
        });
        let noneStocks = ret.filter(v => !this.storeApp.stockFromId(v.stock));
        if (noneStocks.length > 0) {
            await yumi.ActIX({
                IX: yumi.UserAllStock,
                values: noneStocks.map(v => ({ ix: undefined, xi: v.stock }))
            });
            await this.storeApp.loadMyAll();
        }
        let list = ret.map(v => {
            let { id, stock: stockId, cost, everBought } = v;
            let stock = this.storeApp.stockFromId(stockId);
            let holdingStock = new HoldingStock(this, id, stock, v.quantity, cost);
            holdingStock.everBought = everBought;
            return holdingStock;
        });
        list.sort(holdingMiRateSorter);
        setAtomValue(this.holdingStocks, list);
        // setAtomValue(this.count, list.length);
        this.setAccountValue({ count: list.length });
        this.recalc();
        this.setPortionAmount();
    }

    private setPortionAmount() {
        let { market, cash, portion } = this.getAccountValue();
        let v = (market + (cash ?? 0));
        let p = v / portion;
        p = Math.round(p / 1000) * 1000;
        let props: Partial<AccountProps> = {};
        if (p > 0) {
            props.portionAmount = p;
        }
        else {
            props.portion = 5;
            p = v / portion;
            p = Math.round(p / 1000) * 1000;
            if (p > 0) {
                props.portionAmount = p;
            }
            else {
                props.portion = 1;
                props.portionAmount = undefined;
            }
        }
        this.setAccountValue(props);
    }

    async buyNewHolding(stockId: number, price: number, quantity: number) {
        const holdingStocks = getAtomValue(this.holdingStocks);
        let { cash } = this.getAccountValue();
        let holdingId: number;
        let stock = this.storeApp.stockFromId(stockId);
        if (!stock) {
            stock = await this.storeApp.loadStock(stockId);
            if (!stock) throw new Error(`stock ${stockId} not exists`);
        }
        let index = holdingStocks.findIndex(v => v.stock === stockId);
        if (index < 0) {
            holdingId = await this.saveHolding(stockId);
            await this.storeApp.addMyAll(stock);
            let hs = new HoldingStock(this, holdingId, stock, quantity, price * quantity);
            hs.setQuantity(quantity);
            // 新买，cost已经有了，不需要再changeCost
            // hs.changeCost(price, quantity);
            holdingStocks.push(hs);
        }
        else {
            let orgHs = holdingStocks[index];
            holdingId = orgHs.id;
            let holdingQuantity = orgHs.quantity + quantity;
            orgHs.setQuantity(holdingQuantity);
            orgHs.changeCost(price, quantity);
        }
        if (cash) {
            this.setAccountValue({ cash: price * quantity })
        }
        await this.bookHolding(holdingId, price, quantity);
        setAtomValue(this.holdingStocks, [...holdingStocks]);
    }

    async buyHolding(stockId: number, price: number, quantity: number) {
        let { cash } = this.getAccountValue();
        const holdingStocks = getAtomValue(this.holdingStocks);
        let index = holdingStocks.findIndex(v => v.stock === stockId);
        if (index < 0) return;
        let orgHs = holdingStocks[index];
        let holdingId = orgHs.id;
        let holdingQuantity = orgHs.quantity + quantity;
        orgHs.setQuantity(holdingQuantity);
        orgHs.changeCost(price, quantity);
        if (cash) {
            this.setAccountValue({ cash: price * quantity })
        }
        await this.bookHolding(holdingId, price, quantity);
    }

    private async saveHolding(stock: number): Promise<number> {
        let ret = await this.storeApp.yumi.Acts({
            holding: [{ account: this.id, stock, everBought: 1 }]
        });
        return ret.holding[0];
    }

    private async bookHolding(holdingId: number, price: number, quantity: number): Promise<void> {
        this.recalc();
        const { miValue, market, count, cash } = this.getAccountValue();
        await this.storeApp.yumi.Acts({
            accountValue: [{
                id: this.id,
                miValue: miValue,
                market: market,
                count: count,
                cash: { value: cash, setAdd: '=' },
            }],
            accountHolding: [{
                ix: this.id,
                xi: holdingId
            }],
            portfolio: [{
                id: holdingId,
                quantity: quantity,
                cost: price * quantity,
            }],
            transaction: [{
                holding: holdingId,
                tick: undefined,
                price,
                quantity,
                amount: price * quantity,
            }],
        });
    }

    private async bookSetCost(holdingId: number, cost: number): Promise<void> {
        this.recalc();
        const { miValue, market, count } = this.getAccountValue();
        await this.storeApp.yumi.Acts({
            accountValue: [{
                id: this.id,
                miValue: miValue,
                market: market,
                count: count,
            }],
            portfolio: [{
                id: holdingId,
                cost: { value: cost, setAdd: '=' },
            }],
        });
    }

    async sellHolding(stockId: number, price: number, quantity: number) {
        let { cash } = this.getAccountValue();
        const holdingStocks = getAtomValue(this.holdingStocks);
        let holding = holdingStocks.find(v => v.stock === stockId);
        if (holding === undefined) return;
        holding.setQuantity(holding.quantity - quantity);
        holding.changeCost(-price, quantity);
        if (cash) {
            this.setAccountValue({ cash: cash + price * quantity });
        }
        await this.bookHolding(holding.id, price, -quantity);
    }

    async changeCost(stockId: number, costPrice: number) {
        const holdingStocks = getAtomValue(this.holdingStocks);
        let holding = holdingStocks.find(v => v.stock === stockId);
        if (holding === undefined) return;
        holding.setCostPrice(costPrice);
        await this.bookSetCost(holding.id, costPrice * holding.quantity);
    }

    addHoldingStock(holdingStock: HoldingStock) {
        const holdingStocks = getAtomValue(this.holdingStocks);
        if (holdingStocks) {
            holdingStocks.push(holdingStock);
            this.recalc();
        }
        setAtomValue(this.holdingStocks, [...holdingStocks]);
    }

    removeHoldingStock(stockId: number) {
        const holdingStocks = getAtomValue(this.holdingStocks);
        if (holdingStocks) {
            let index = holdingStocks.findIndex(v => v.stock === stockId);
            if (index >= 0) {
                holdingStocks.splice(index, 1);
                this.recalc();
            }
        }
        setAtomValue(this.holdingStocks, [...holdingStocks]);
    }

    private recalc() {
        const holdingStocks = getAtomValue(this.holdingStocks);
        let { portion } = this.getAccountValue();
        let sumMiValue = 0, sumMarket = 0, sumDivident = 0, boughtCount = 0;
        for (let hs of holdingStocks) {
            let { stockObj, market, divident, quantity, everBought } = hs;
            if (everBought === 0) continue;
            let { miRate } = stockObj;
            let miValue = (miRate ?? 0) * market / 100;
            hs.miValue = miValue;
            sumMiValue += miValue;
            sumMarket += market;
            sumDivident += divident;
            if (quantity > 0) ++boughtCount;
        }
        let props: Partial<AccountProps> = {
            count: holdingStocks.length,
            miValue: sumMiValue,
            market: sumMarket,
            divident: sumDivident,
            buyableCount: portion - boughtCount,
        }
        this.setAccountValue(props);
    }

    private async cashAct(cash: number): Promise<void> {
        await this.storeApp.yumi.Acts({
            accountValue: [{ id: this.id, cash }]
        });
        this.setAccountValue({ cash });
    }

    async cashInit(amount: number) {
        let cash = amount;
        await this.cashAct(cash);
    }

    async cashIn(amount: number) {
        let { cash } = this.getAccountValue();
        cash += amount;
        await this.cashAct(cash);
    }

    async cashOut(amount: number) {
        let { cash } = this.getAccountValue();
        cash -= amount;
        await this.cashAct(cash);
    }

    async cashAdjust(amount: number) {
        let { cash } = this.getAccountValue();
        if (cash) {
            amount += cash;
        }
        await this.cashAct(amount);
    }
}
