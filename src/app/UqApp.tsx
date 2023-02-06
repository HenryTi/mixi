import { useContext } from 'react';
import { getAtomValue, setAtomValue } from 'tonwa-com';
import { AppConfig, AppEnv, UqAppBase, UqAppContext, ViewUqAppBase } from "tonwa-app";
import { UqConfig, UqQuery } from 'tonwa-uq';
import { UQs, uqsSchema } from "uqs";
import uqconfigJson from '../uqconfig.json';
import { ViewsRoutes } from './views';
import { MiNet } from './tool';
import { StoreApp } from './stores';
import { appEnv } from './appEnv';

const appConfig: AppConfig = {
    version: '0.1.0',
    center: 'https://tv.jkchemical.com',
    noUnit: true,
    oem: undefined,
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
    return useContext<UqApp>(UqAppContext);
}

export interface Title {
    title: string;
    vice?: string;
    unit?: string;
    fixed?: number;
}

let myUqAppId = 1;
export class UqApp extends UqAppBase<UQs> {
    id = myUqAppId++;
    timezone: number;
    unitTimezone: number;
    unitBizDate: number;
    unitBizMonth: number;

    miNet: MiNet;
    storeApp: StoreApp;

    get pathLogin() { return '/login'; }
    // 数据服务器提醒客户端刷新，下面代码重新调入的数据
    refresh = async () => {
        let d = Date.now() / 1000;
        let refreshTime = getAtomValue(this.refreshTime);
        if (d - refreshTime < 30) return;
        await Promise.all([
            // this.cHome.load(),
            // this.cUnitPortal?.load(),
        ]);
        setAtomValue(this.refreshTime, d);
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
        let user = getAtomValue(this.user);
        this.miNet = new MiNet(user);
        let { BrMi } = this.uqs;
        this.storeApp = new StoreApp(this);
        let [] = await Promise.all([
            this.storeApp.load(),
            this.loadUnitTime(BrMi.$getUnitTime),
        ]);
    }
}

const uqConfigs = uqConfigsFromJson(uqconfigJson);

export const uqApp = new UqApp(appConfig, uqConfigs, uqsSchema, appEnv);
export function ViewUqApp() {
    return <ViewUqAppBase uqApp={uqApp}>
        <ViewsRoutes />
    </ViewUqAppBase>
}
