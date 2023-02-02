import { MyPageStore } from "app/MyPageStore";
import { MyUqApp } from "app/MyUqApp";
import { proxy } from "valtio";

type SearchOrder = 'miRateDesc' | 'miRateAsc' | 'dvRateDesc' | 'dvRateAsc' | 'roeDesc' | 'roeAsc';
export interface SearchParam {
    key: string;
    market: string;
    $orderSwitch: SearchOrder;
    smooth: number;
}

export class StoreSearch extends MyPageStore {
    searchOrder: SearchOrder = 'miRateDesc';
    searchParam: SearchParam;
    smooth: number;
    key: string;
    markets: string[];
    state = proxy({
        items: [],
    });

    constructor(uqApp: MyUqApp, key: string, markets: string[]) {
        super(uqApp);
        this.key = key;
        this.markets = markets;
        this.smooth = 0;
    }
    async init() {
        await this.search();
    }

    async search() {
        let pageStart = 0;
        let pageSize = 100;
        this.searchParam = {
            key: this.key,
            market: this.markets?.join('\n'),
            $orderSwitch: this.searchOrder,
            smooth: this.key ? 0 : this.smooth,
        };
        this.state.items = await this.searchStock(
            { ...this.searchParam, smooth: this.searchParam.smooth + 1 }
            , pageStart, pageSize);
    }

    async searchStock(param: SearchParam, pageStart: number, pageSize: number) {
        const yumi = this.uqs.BrMi;
        let ret = await yumi.SearchStock.page(param, pageStart, pageSize);
        let { $page } = ret;
        //$page.forEach(v => this.uqApp.storeApp.buildStockValues(v as unknown as (Stock & StockValue)));
        return $page;
    }
}
