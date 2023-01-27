import { BrMi } from "uqs";
import { Stock, StockValue } from "uqs/BrMi";
import { MGroup, MiGroup, MIndustry, MRootIndustry } from "./MGroup";
import { StoreApp } from "./StoreApp";

export abstract class MGroups<T extends MGroup> {
    protected storeApp: StoreApp;
    groups: T[];
    constructor(storeApp: StoreApp) {
        this.storeApp = storeApp;
    }

    abstract load(): Promise<void>;

    groupsFromIds(ids: number[]): MGroup[] {
        let ret: MGroup[] = [];
        let len = this.groups.length;
        for (let i = 0; i < len; i++) {
            let group = this.groups[i];
            if (ids.findIndex(v => v === group.id) >= 0) {
                ret.push(group);
            }
        }
        return ret;
    }

    calcStockCount() { }
}

export class MiGroups extends MGroups<MiGroup> {
    async load(): Promise<void> {
        try {
            let { yumi } = this.storeApp;
            let ret = await yumi.IX<BrMi.Group>({
                IX: yumi.UserGroup,
                IDX: [yumi.Group],
                ix: undefined,
            });
            this.groups = ret.map(v => new MiGroup(this.storeApp, v));
        }
        catch (err) {
            debugger;
            console.error(err);
        }
    }

    calcStockCount() {
        this.groups.forEach(v => {
            let stockCount = this.storeApp.calcGroupStockCount(v.id);
            v.count = stockCount;
        });
    }

    async addStockToGroup(stock: Stock & StockValue, group: MiGroup) {
        let { yumi } = this.storeApp;
        let { stocksMyAll, groupIXs } = this.storeApp;
        let stockId = stock.id;
        let groupId = group.id;
        await yumi.Acts({
            groupStock: [{ ix: groupId, xi: stockId, seq: undefined }],
            userAllStock: [{ ix: undefined, xi: stockId }],
        });
        groupIXs.push({ ix: groupId, xi: stockId });
        let index = stocksMyAll.findIndex(v => v.id === stockId);
        if (index < 0) stocksMyAll.push(stock);
        let stockCount = this.storeApp.calcGroupStockCount(groupId);
        group.addStock(stock, stockCount);
    }

    async removeStockFromGroup(stock: Stock & StockValue, group: MiGroup) {
        let { yumi } = this.storeApp;
        let stockId = stock.id;
        let groupId = group.id;
        await yumi.Acts({
            groupStock: [{ ix: groupId, xi: -stockId, seq: undefined }],
        });
        let { groupIXs } = this.storeApp;
        for (let i = 0; i < groupIXs.length; i++) {
            let { ix, xi } = groupIXs[i];
            if (xi !== stockId) continue;
            if (ix !== groupId) continue;
            groupIXs.splice(i, 1);
            let stockCount = this.storeApp.calcGroupStockCount(groupId);
            group.removeStock(stock, stockCount);
            break;
        }
    }
}

export class MIndustries extends MGroups<MIndustry> {
    async load(): Promise<void> {
        try {
            let { yumi } = this.storeApp;
            let ret = await yumi.ID<BrMi.Group>({
                IDX: [yumi.Industry],
                id: undefined,
            });
            this.groups = ret.map(v => new MIndustry(this.storeApp, v));
        }
        catch (err) {
            debugger;
            console.error(err);
        }
    }
}

export class MRootIndustries extends MGroups<MRootIndustry> {
    async load(): Promise<void> {
        try {
            let { yumi } = this.storeApp;
            let ret = await yumi.IX<BrMi.Group>({
                IX: yumi.IXIndustry,
                IDX: [yumi.Industry],
                ix: 0,
            });
            this.groups = ret.map(v => new MRootIndustry(this.storeApp, v));
        }
        catch (err) {
            debugger;
            console.error(err);
        }
    }
}
