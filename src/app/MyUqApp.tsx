import { useContext } from 'react';
import { AppConfig, UqApp, UqAppContext, ViewUqApp/*, useUqStore, Store */ } from "tonwa-uq-com";
import { UqConfig, UqQuery } from 'tonwa-uq';
import { UQs, uqsSchema } from "uqs";
//import { Item, Post, EnumRole, EnumRoleOp, EnumAccount } from "uqs/JkMe";
import uqconfigJson from '../uqconfig.json';
//import { RoleNames } from './RoleNames';
import { proxy } from 'valtio';
import { ViewsRoutes } from './views';
import { MiNet } from './tool';
import { StoreApp } from './stores';

const appConfig: AppConfig = {
    version: '0.1.0',
    center: 'https://tv.jkchemical.com',
    noUnit: true,
    oem: undefined,
    htmlTitle: 'Warehouse',
};

function uqConfigsFromJson(json: { devs: { [dev: string]: any }; uqs: any[]; }): UqConfig[] {
    let ret: UqConfig[] = [];
    let { devs, uqs } = json;
    for (let uq of uqs) {
        let { dev, name, alias } = uq;
        ret.push({
            dev: devs[dev],
            name,
            alias,
        });
    }
    return ret;
}

export function useUqApp() {
    return useContext<MyUqApp>(UqAppContext);
}

export interface Title {
    title: string;
    vice?: string;
    unit?: string;
    fixed?: number;
}

let myUqAppId = 1;
export class MyUqApp extends UqApp<UQs> {
    id = myUqAppId++;
    timezone: number;
    unitTimezone: number;
    unitBizDate: number;
    unitBizMonth: number;

    miNet: MiNet;
    storeApp: StoreApp;

    // 数据服务器提醒客户端刷新，下面代码重新调入的数据
    refresh = async () => {
        let d = Date.now() / 1000;
        if (d - this.state.refreshTime < 30) return;
        await Promise.all([
            // this.cHome.load(),
            // this.cUnitPortal?.load(),
        ]);
        this.state.refreshTime = d;
    }

    private async loadUnitTime($getTimezone: UqQuery<any, any>) {
        let ret = await $getTimezone.query({});
        let tz = ret.ret[0];
        this.timezone = tz.timezone ?? 8;
        this.unitTimezone = tz.unitTimeZone ?? 8;
        this.unitBizMonth = (tz.unitBizMonth ?? 1) - 1;
        this.unitBizDate = tz.unitBizDate ?? 1;
    }

    protected override async loadOnLogined(): Promise<void> {
        this.miNet = new MiNet(this.state.user);
        let { BrMi } = this.uqs;
        this.storeApp = new StoreApp(this);
        let [] = await Promise.all([
            this.storeApp.load(),
            this.loadUnitTime(BrMi.$getUnitTime),
        ]);
    }
}

const uqConfigs = uqConfigsFromJson(uqconfigJson);
const uqApp = new MyUqApp(appConfig, uqConfigs, uqsSchema);
export function ViewUqAppMy() {
    return <ViewUqApp uqApp={uqApp}>
        <ViewsRoutes />
    </ViewUqApp>
}
