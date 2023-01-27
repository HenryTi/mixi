import { ParamIX } from "tonwa-uq";
import { Account, AccountValue, Stock, StockValue } from "uqs/BrMi";
import { HoldingStock } from "./HoldingStock";
import { MiAccount } from "./MiAccount";
import { StoreApp } from "./StoreApp";

export class MiAccounts {
    private storeApp: StoreApp;
    accounts: MiAccount[];

    constructor(storeApp: StoreApp) {
        this.storeApp = storeApp;
    }

    async load() {
        let { yumi } = this.storeApp;
        let { UserAccount, Account, AccountValue } = yumi;
        let param: ParamIX = {
            IX: UserAccount,
            IDX: [Account, AccountValue],
            ix: undefined,			// auto userId
        };
        let ret = await yumi.IX<Account & AccountValue>(param);
        if (ret.length === 0) {
            // 没有持仓账号，则创建默认账号
            //let accountNO = await Account.NO();
            let accountName = '我的持仓组合';
            let retActs = await yumi.ActIX({
                IX: UserAccount,
                ID: Account,
                values: [{
                    ix: undefined,
                    xi: {
                        name: accountName,
                    }
                }]
            });
            //ret = await this.yumi.IDinIX(param);
            ret.push({
                id: retActs[0],
                name: accountName,
            } as any);
        }
        let accounts = ret.map(v => new MiAccount(this.storeApp, v));
        this.accounts = accounts;
    }

    accountsFromIds(ids: number[]): MiAccount[] {
        let ret: MiAccount[] = [];
        let len = this.accounts.length;
        for (let i = 0; i < len; i++) {
            let account = this.accounts[i];
            let { id } = account.state;
            if (ids.findIndex(v => v === id) >= 0) {
                ret.push(account);
            }
        }
        return ret;
    }

    async addStockToAccount(stock: Stock & StockValue, account: MiAccount) {
        let { yumi } = this.storeApp;
        let { holdingStocks, id } = account.state;
        if (holdingStocks) {
            let index = holdingStocks.findIndex(v => v.stock === stock.id);
            if (index >= 0) return;
        }
        let ret = await yumi.ActIX({
            IX: yumi.AccountHolding,
            ID: yumi.Holding,
            values: [{ ix: id, xi: { account: id, stock: stock.id, everBought: 0 } }],
        });
        let hs = new HoldingStock(account, ret[0], stock, 0, 0);
        hs.everBought = 0;
        account.addHoldingStock(hs);
    }

    async removeStockFromAccount(stock: Stock & StockValue, account: MiAccount) {
        let { yumi } = this.storeApp;
        let { id } = account.state;
        await yumi.ActIX({
            IX: yumi.AccountHolding,
            values: [{ ix: id, xi: -stock.id }],
        });
        account.removeHoldingStock(stock.id);
    }
}
