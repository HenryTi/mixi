import { User } from "tonwa-uq";
import { BrMi, UQs } from "uqs";
import { proxy, ref } from "valtio";
import { Holding, Industry, Market, Stock, StockValue } from "uqs/BrMi";
import { MGroup, MiGroup, MIndustry } from "./MGroup";
import { MiGroups, MIndustries, MRootIndustries } from "./MGroups";
import { MiAccount } from "./MiAccount";
import { MiAccounts } from "./MiAccounts";
import { stockMiRateSorter } from "./sorter";
import { MyUqApp } from "app/MyUqApp";
import { MiNet } from "app/tool";

export interface IXBase {
    ix: number;
    xi: number;
}

export class StoreApp {
    private readonly user: User;
    private miNet: MiNet;
    readonly myAllColl: { [id: number]: boolean } = {};
    readonly yumi: BrMi.UqExt;
    readonly markets: { [id: number]: { id?: number; name: string; currency: string; } } = {};
    miAccounts: MiAccounts;
    miGroups: MiGroups;
    industries: MIndustries;
    rootIndustries: MRootIndustries;

    stocksMyAll: (Stock & StockValue)[];
    stocksMyBlock: (Stock & StockValue)[];
    groupIXs: IXBase[];

    state = proxy({
        trackDay: null as number,
    });

    constructor(uqApp: MyUqApp) {
        this.miNet = uqApp.miNet;
        this.user = uqApp.uqAppState.user;
        this.yumi = uqApp.uqs.BrMi;
        this.miAccounts = new MiAccounts(this);
        this.miGroups = new MiGroups(this);
        this.industries = new MIndustries(this);
        this.rootIndustries = new MRootIndustries(this);
    }

    stockFromId(stockId: number): Stock & StockValue {
        return this.stocksMyAll.find(v => v.id === stockId);
    }

    async loadStock(stockId: number): Promise<Stock & StockValue> {
        let ret = await this.yumi.ID<Stock & StockValue>({
            IDX: [this.yumi.Stock, this.yumi.StockValue],
            id: stockId,
        });
        let stock = ret[0];
        //this.buildStockValues(stock);
        return stock;
    }

    getMarket(stock: Stock) {
        return this.markets[stock.market];
    }

    /*
    buildStockValues(stock: Stock & StockValue) {
        if (stock === undefined) return;
        let { market } = stock;
        (stock as any).$market = this.markets[market];
    }
    */

    async searchStock(param: any, pageStart: any, pageSize: number): Promise<{ [name: string]: any[] }> {
        let ret = await this.yumi.SearchStock.page(param, pageStart, pageSize);
        //let { $page } = ret;
        //$page.forEach(v => this.buildStockValues(v as unknown as (Stock & StockValue)));
        return ret as any;
    }

    isMyAll(stock: Stock): boolean {
        return this.myAllColl[stock.id] === true;
    }

    async addMyAll(stock: Stock & StockValue) {
        if (!stock) return;
        await this.yumi.ActIX({
            IX: this.yumi.UserAllStock,
            values: [
                { ix: undefined, xi: stock.id }
            ]
        });
        let stockId = stock.id;
        const { stocksMyAll } = this;
        if (stocksMyAll.findIndex(v => v.id === stockId) < 0) {
            stocksMyAll.push(stock);
        }
        this.myAllColl[stockId] = true;
    }

    async removeMyAll(stock: Stock & StockValue): Promise<{ miAccounts: MiAccount[], miGroups: MGroup[] }> {
        if (!stock) return;
        let stockId = stock.id;
        let ret = await this.yumi.StockUsing.query({ stock: stockId });
        let { groups, accounts } = ret;
        if (groups.length > 0 || accounts.length > 0) {
            let miAccounts = this.miAccounts.accountsFromIds(accounts.map(v => v.account));
            let miGroups = this.miGroups.groupsFromIds(groups.map(v => v.group));
            return { miAccounts, miGroups };
        }

        await this.yumi.ActIX({
            IX: this.yumi.UserAllStock,
            values: [
                { ix: undefined, xi: -stockId }
            ]
        });
        const { stocksMyAll } = this;
        let index = stocksMyAll.findIndex(v => v.id === stockId);
        if (index >= 0) stocksMyAll.splice(index, 1);
        delete this.myAllColl[stockId];
    }

    myAllCaption: string = '自选股';
    myBlockCaption: string = '黑名单';

    async loadMyAll() {
        let ret = await this.yumi.IX<(Stock & StockValue)>({
            IX: this.yumi.UserAllStock,
            IDX: [this.yumi.Stock, this.yumi.StockValue],
            ix: undefined,
        });
        ret.forEach(v => {
            //this.buildStockValues(v);
            this.myAllColl[v.id] = true;
        });
        this.stocksMyAll = ret.map(v => ref(v));
    }

    async loadMyBlock() {
        if (this.stocksMyBlock) return;
        let { yumi } = this;
        let ret = await yumi.IX<(Stock & StockValue)>({
            IX: yumi.UserBlockStock,
            IDX: [yumi.Stock, yumi.StockValue],
            ix: undefined,
        });
        //ret.forEach(v => this.buildStockValues(v));
        this.stocksMyBlock = ret.map(v => ref(v));
    }

    async loadGroupStocks(groupId: number): Promise<(Stock & StockValue)[]> {
        let unloadArr: number[] = [];
        let ret: (Stock & StockValue)[] = [];
        this.groupIXs.forEach(gs => {
            let { ix, xi: gStockId } = gs;
            if (ix !== groupId) return;
            let stock = this.stocksMyAll.find(v => v.id === gStockId);
            if (stock) ret.push(stock);
            else unloadArr.push(gStockId);
        });
        if (unloadArr.length > 0) {
            let stockArr = await this.yumi.ID<Stock & StockValue>({
                IDX: [this.yumi.Stock, this.yumi.StockValue],
                id: unloadArr,
            });
            for (let stock of stockArr) {
                //this.buildStockValues(stock);
                this.stocksMyAll.push(stock);
                ret.push(stock);
            }
        }
        return ret;
    }

    async loadIndustryStocks(industryId: number): Promise<(Stock & StockValue)[]> {
        let stockArr = await this.yumi.IX<Stock & StockValue>({
            IX: this.yumi.GroupStock,
            IDX: [this.yumi.Stock, this.yumi.StockValue],
            ix: industryId,
        });
        //stockArr.forEach(v => this.buildStockValues(v));
        stockArr.sort(stockMiRateSorter);
        return stockArr;
    }

    async loadRootIndustry(rootIndustryId: number): Promise<[Industry[], (Stock & StockValue)[]]> {
        let ret = await Promise.all([
            this.yumi.IX<Stock & StockValue>({
                IX: this.yumi.IXIndustry,
                IDX: [this.yumi.Industry],
                ix: rootIndustryId,
            }),
            this.yumi.IX<Stock & StockValue>({
                IX: this.yumi.IXIndustry,
                IX1: this.yumi.GroupStock,
                IDX: [this.yumi.Stock, this.yumi.StockValue],
                ix: rootIndustryId,
            }),
        ]);
        let [industries, stockArr] = ret;
        //stockArr.forEach(v => this.buildStockValues(v));
        stockArr.sort(stockMiRateSorter);
        let miGroups = industries.map(v => new MIndustry(this, v));
        return [miGroups, stockArr];
    }

    async loadMarkets() {
        let { yumi } = this;
        let ret = await yumi.ID<Market>({
            IDX: [yumi.Market],
            id: undefined,
        });
        for (let m of ret) {
            let { id } = m;
            this.markets[id] = m; // { ...m, el: marketElements[name] };
        }
    }

    toggleMyAll(stock: Stock & StockValue) {
        if (this.isMyAll(stock)) {
            this.removeMyAll(stock);
        }
        else {
            this.addMyAll(stock);
        }
    }

    isMyBlock(stock: Stock): boolean {
        let index = this.stocksMyBlock.findIndex(v => v.id === stock.id);
        return index >= 0;
    }

    async toggleBlock(stock: Stock & StockValue) {
        if (!stock) return;
        await this.loadMyBlock();
        let { id } = stock;
        let index = this.stocksMyBlock.findIndex(v => v.id === id);
        if (index >= 0) {
            await this.yumi.ActIX({
                IX: this.yumi.UserBlockStock,
                values: [{ ix: undefined, xi: -id }]
            })
            this.stocksMyBlock.splice(index, 1);
        }
        else {
            await this.yumi.ActIX({
                IX: this.yumi.UserBlockStock,
                values: [{ ix: undefined, xi: id }]
            })
            this.stocksMyBlock.push(stock);
        }
    }

    async load() {
        await this.loadMarkets();
        await Promise.all([
            this.miAccounts.load(),
            this.loadMyAll(),
            this.loadGroupIXs(),
            this.miGroups.load(),
            this.industries.load(),
            this.rootIndustries.load(),
        ]);
        this.miGroups.calcStockCount();
    }

    private async loadGroupIXs() {
        let { yumi } = this;
        let ret = await yumi.IX<IXBase>({
            IX: yumi.UserGroup,
            IX1: yumi.GroupStock,
            ix: undefined,
        });
        this.groupIXs = ret;
    }

    stockInNGroup(stock: Stock): number {
        let nGroup = 0;
        let { groupIXs } = this;
        let stockId = stock.id;
        for (let i = 0; i < groupIXs.length; i++) {
            let { xi } = groupIXs[i];
            if (xi === stockId) ++nGroup;
        }
        return nGroup;
    }

    calcGroupStockCount(groupId: number): number {
        if (!this.groupIXs) return;
        let count = 0;
        for (let gs of this.groupIXs) {
            let { ix } = gs;
            if (ix === groupId) ++count;
        }
        return count;
    }

    inAnyGroup(stockId: number): { [groupId: number]: boolean } {
        let inGroup: { [groupId: number]: boolean } = {};
        for (let gs of this.groupIXs) {
            let { ix, xi } = gs;
            if (xi === stockId) inGroup[ix] = true;
        }
        return inGroup;
    }

    inAnyAccount(stockId: number): { [accountId: number]: [inAccount: boolean, everBought: boolean] } {
        let inAccount: { [accountId: number]: [inAccount: boolean, everBought: boolean] } = {};
        this.miAccounts.accounts.forEach(v => {
            let { holdingStocks, id } = v.state;
            if (!holdingStocks) return;
            let len = holdingStocks.length;
            for (let i = 0; i < len; i++) {
                let hs = holdingStocks[i];
                if (hs.stock === stockId) {
                    inAccount[id] = [true, hs.everBought > 0];
                    break;
                }
            }
        });
        return inAccount;
    }

    async loadStockInAccounts(stockId: number): Promise<{ [accountId: number]: [inAccount: boolean, everBought: boolean] }> {
        let ret = await this.yumi.QueryID<Holding>({
            IX: [this.yumi.UserAccount, this.yumi.AccountHolding],
            IDX: [this.yumi.Holding],
            ix: undefined,
            keyx: { account: undefined, stock: stockId },
        });
        let val: { [accountId: number]: [inAccount: boolean, everBought: boolean] } = {};
        for (let r of ret) {
            let { account, everBought } = r;
            val[account] = [true, everBought > 0];
        }
        return val;
    }

    async getNextTradedays(day: number) {
        return await this.miNet.q_getnexttradedays(day);
    }

    async getNextWeekend(day: number) {
        return await this.miNet.q_nextweekend(day);
    }

    async searchTrackStock(param: any, pageStart: any, pageSize: number): Promise<{ [name: string]: any[] }> {
        let { day, key, market, $orderSwitch, smooth } = param as { day: number, key: string, market: string, $orderSwitch?: any, smooth?: number, }
        let ret = await this.miNet.q_searchstock(day, this.user.id, pageStart, pageSize, $orderSwitch, key, market, smooth);
        //let { $page } = ret;
        //$page.forEach(v => this.buildStockValues(v as unknown as (Stock & StockValue)));
        return ret as any;
    }

    setStockToGroup = async (stock: Stock & StockValue, closeLevelWhenRemoved: number) => {
        /*
        this.stock = stock;
        let { store } = this.cApp;
        this.state.stockInAccounts = await store.loadStockInAccounts(stock.id);
        this.openVPage(VStockInGroup, closeLevelWhenRemoved);
        */
    }

    setGroup = async (checked: boolean, group: MiGroup) => {
        /*
        let { miGroups } = this.cApp.store;
        if (checked === true) {
            await miGroups.addStockToGroup(this.stock, group);
        }
        else {
            await miGroups.removeStockFromGroup(this.stock, group);
        }
        */
    }

    setStockToAccount = async (checked: boolean, account: MiAccount) => {
        /*
        let { miAccounts } = this.cApp.store;
        if (checked === true) {
            await miAccounts.addStockToAccount(this.stock, account);
        }
        else {
            await miAccounts.removeStockFromAccount(this.stock, account);
        }
        */
    }

}
