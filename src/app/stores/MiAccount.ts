import { Account, AccountValue, Holding, Portfolio } from "uqs/BrMi";
import { proxy, ref } from "valtio";
import { HoldingStock } from "./HoldingStock";
import { holdingMiRateSorter } from "./sorter";
import { StoreApp } from "./StoreApp";

interface MiAccountState {
    holdingStocks: HoldingStock[];
    portionAmount: number;
    buyableCount: number;
    divident: number;
}

export class MiAccount {
    protected readonly store: StoreApp;
    readonly state: Account & AccountValue & MiAccountState;

    constructor(store: StoreApp, account: Account & AccountValue) {
        this.store = store;
        this.state = proxy<Account & AccountValue & MiAccountState>({
            id: null,
            no: null,
            holdingStocks: null as HoldingStock[],
            name: null,
            portion: 20,
            count: 0,
            portionAmount: null,
            buyableCount: 0,
            miValue: 0,
            market: 0,
            divident: 0,
            cash: null,
        });
        Object.assign(this.state, account);
    }

    async loadItems() {
        const { holdingStocks, id } = this.state;
        if (holdingStocks) {
            holdingStocks.sort(holdingMiRateSorter);
            return;
        }
        let { yumi } = this.store;
        let ret = await yumi.IX<Holding & Portfolio>({
            IX: yumi.AccountHolding,
            ix: id,
            IDX: [yumi.Holding, yumi.Portfolio]
        });
        let noneStocks = ret.filter(v => !this.store.stockFromId(v.stock));
        if (noneStocks.length > 0) {
            await yumi.ActIX({
                IX: yumi.UserAllStock,
                values: noneStocks.map(v => ({ ix: undefined, xi: v.stock }))
            });
            await this.store.loadMyAll();
        }
        let list = ret.map(v => {
            let { id, stock: stockId, cost, everBought } = v;
            let stock = this.store.stockFromId(stockId);
            let holdingStock = new HoldingStock(this, id, stock, v.quantity, cost);
            holdingStock.everBought = everBought;
            return holdingStock;
        });
        list.sort(holdingMiRateSorter);
        this.state.holdingStocks = list.map(v => ref(v));
        this.state.count = list.length;
        this.recalc();
        this.setPortionAmount();
    }

    private setPortionAmount() {
        let { market, cash, portion } = this.state;
        let v = (market + (cash ?? 0));
        let p = v / portion;
        p = Math.round(p / 1000) * 1000;
        if (p > 0) {
            this.state.portionAmount = p;
            return;
        }
        this.state.portion = 5;
        p = v / portion;
        p = Math.round(p / 1000) * 1000;
        if (p > 0) {
            this.state.portionAmount = p;
            return;
        }
        this.state.portion = 1;
        this.state.portionAmount = undefined;
    }

    async buyNewHolding(stockId: number, price: number, quantity: number) {
        const { holdingStocks, cash } = this.state;
        let holdingId: number;
        let stock = this.store.stockFromId(stockId);
        if (!stock) {
            stock = await this.store.loadStock(stockId);
            if (!stock) throw new Error(`stock ${stockId} not exists`);
        }
        let index = holdingStocks.findIndex(v => v.stock === stockId);
        if (index < 0) {
            holdingId = await this.saveHolding(stockId);
            await this.store.addMyAll(stock);
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
            this.state.cash -= price * quantity;
        }
        await this.bookHolding(holdingId, price, quantity);
    }

    async buyHolding(stockId: number, price: number, quantity: number) {
        const { holdingStocks, cash } = this.state;
        let index = holdingStocks.findIndex(v => v.stock === stockId);
        if (index < 0) return;
        let orgHs = holdingStocks[index];
        let holdingId = orgHs.id;
        let holdingQuantity = orgHs.quantity + quantity;
        orgHs.setQuantity(holdingQuantity);
        orgHs.changeCost(price, quantity);
        if (cash) {
            this.state.cash -= price * quantity;
        }
        await this.bookHolding(holdingId, price, quantity);
    }

    private async saveHolding(stock: number): Promise<number> {
        const { id } = this.state;
        let ret = await this.store.yumi.Acts({
            holding: [{ account: id, stock, everBought: 1 }]
        });
        return ret.holding[0];
    }

    private async bookHolding(holdingId: number, price: number, quantity: number): Promise<void> {
        this.recalc();
        const { id, miValue, market, count, cash } = this.state;
        await this.store.yumi.Acts({
            accountValue: [{
                id: id,
                miValue: miValue,
                market: market,
                count: count,
                cash: { value: cash, setAdd: '=' },
            }],
            accountHolding: [{
                ix: id,
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
        const { id, miValue, market, count, cash } = this.state;
        await this.store.yumi.Acts({
            accountValue: [{
                id: id,
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
        const { holdingStocks, cash } = this.state;
        let holding = holdingStocks.find(v => v.stock === stockId);
        if (holding === undefined) return;
        holding.setQuantity(holding.quantity - quantity);
        holding.changeCost(-price, quantity);
        if (cash) {
            this.state.cash += price * quantity;
        }
        await this.bookHolding(holding.id, price, -quantity);
    }

    async changeCost(stockId: number, costPrice: number) {
        const { holdingStocks, cash } = this.state;
        let holding = holdingStocks.find(v => v.stock === stockId);
        if (holding === undefined) return;
        holding.setCostPrice(costPrice);
        await this.bookSetCost(holding.id, costPrice * holding.quantity);
    }

    addHoldingStock(holdingStock: HoldingStock) {
        const { holdingStocks } = this.state;
        if (holdingStocks) {
            holdingStocks.push(holdingStock);
            this.recalc();
        }
    }

    removeHoldingStock(stockId: number) {
        const { holdingStocks } = this.state;
        if (holdingStocks) {
            let index = holdingStocks.findIndex(v => v.stock === stockId);
            if (index >= 0) {
                holdingStocks.splice(index, 1);
                this.recalc();
            }
        }
    }

    private recalc() {
        const { holdingStocks, portion } = this.state;
        this.state.count = holdingStocks.length;
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
        this.state.miValue = sumMiValue;
        this.state.market = sumMarket;
        this.state.divident = sumDivident;
        this.state.buyableCount = portion - boughtCount;
    }

    private async cashAct(cash: number): Promise<void> {
        await this.store.yumi.Acts({
            accountValue: [{ id: this.state.id, cash }]
        });
        this.state.cash = cash;
    }

    async cashInit(amount: number) {
        let cash = amount;
        await this.cashAct(cash);
    }

    async cashIn(amount: number) {
        let cash = this.state.cash + amount;
        await this.cashAct(cash);
    }

    async cashOut(amount: number) {
        let cash = this.state.cash - amount;
        await this.cashAct(cash);
    }

    async cashAdjust(amount: number) {
        let { cash } = this.state;
        if (cash) {
            amount += cash;
        }
        await this.cashAct(amount);
    }
}
