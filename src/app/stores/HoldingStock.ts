import { Holding, Portfolio, Stock, StockValue } from "uqs/BrMi";
import { MiAccount } from "./MiAccount";

export class HoldingStock implements Holding, Portfolio {
    readonly miAccount: MiAccount;
    id: number;
    account: number;
    stock: number;
    price: number;
    quantity: number;
    miValue: number;				// 米息
    market: number;			// 市值
    divident: number;		// 股息
    stockObj: Stock & StockValue;
    everBought: number;
    cost: number;

    constructor(miAccount: MiAccount, holdingId: number, stock: Stock & StockValue, quantity: number, cost: number) {
        this.miAccount = miAccount;
        this.id = holdingId;
        this.stock = stock.id;
        this.stockObj = stock;
        this.price = stock.price;
        this.cost = cost ? cost : quantity * this.price;
        this.setQuantity(quantity);
    }

    setQuantity(quantity: number) {
        this.quantity = quantity;
        let { divident, miRate } = this.stockObj;
        if (miRate === undefined) miRate = 0;
        if (divident === undefined) divident = 0;
        this.market = quantity * this.price;
        this.miValue = this.market * miRate / 100;
        this.divident = quantity * (divident ?? 0);
    }

    changeCost(price: number, quantity: number) {
        this.cost = this.cost + price * quantity;
    }

    setCostPrice(costPrice: number) {
        this.cost = this.quantity * costPrice;
    }
}
