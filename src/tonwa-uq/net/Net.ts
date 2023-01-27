/* eslint-disable */
// import { UqTokens } from "./UqTokens";
// import { CenterApi } from "./centerApi";
import { UqTokenApi } from "./uqApi";
// import { CallCenterApi, UqTokenApi } from "./uqApi";
import { UserApi } from "./userApi";
import { HttpChannel } from './httpChannel';
// import { MessageHub } from "./messageHub";
// import { WsBridge, WSChannel } from "./wsChannel";
import { buildHosts, Hosts } from './host';
import { LocalDb } from "../tool";
import { env } from "tonwa-com";

export interface PromiseValue<T> {
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}

export interface NetProps {
    center: string;
    unit: number;
    testing: boolean;
    // buildingUq?: boolean;           // default false
    localDb: LocalDb;
    createObservableMap(): Map<number, any>;
}

interface UqToken {
    name: string;
    db: string;
    url: string;
    token: string;
}

export class Net {
    logout() {
        // throw new Error('Method not implemented.');
    }
    private centerDebug: string;
    private uqDebug: string;
    private resDebug: string;
    private debugUqs: Set<string> = new Set<string>();
    // private hosts: Hosts;
    private testing: boolean;
    private uqChannels: { [uq: string]: (HttpChannel | Promise<HttpChannel>) } = {};

    private centerChannel: HttpChannel;
    private readonly isDevelopment: boolean;
    private centerToken: string | undefined = undefined;
    private readonly props: NetProps;
    private _loginedUserId: number = 0;
    private readonly localDb: LocalDb;

    // centerHost: string;

    // readonly centerApi: CenterApi;
    // readonly uqTokens: UqTokens;
    readonly userApi: UserApi;
    readonly uqTokenApi: UqTokenApi;
    // readonly callCenterapi: CallCenterApi;
    //readonly guestApi: GuestApi;
    // readonly messageHub: MessageHub;
    // readonly wsBridge: WsBridge;
    //readonly hostMan: HostMan;

    // 下面的变量应该以后会去掉
    // isBuildingUQ: boolean;
    // _uqs: any;
    // user: any;
    // -- end -------------------

    constructor(props: NetProps) {
        this.props = props;
        this.isDevelopment = env.isDevelopment;
        /*
        if (process.env.REACT_APP_NODE_ENV === 'production') {
            this.isDevelopment = false;
        }
        else {
            this.isDevelopment = process.env.NODE_ENV === 'development';
        }
        */
        this.testing = props.testing;
        this.localDb = this.props.localDb;
        this.createObservableMap = this.props.createObservableMap;

        this.userApi = new UserApi(this, 'tv/');
        this.uqTokenApi = new UqTokenApi(this, 'tv/');

        // this.centerApi = new CenterApi(this, 'tv/');
        // this.uqTokens = new UqTokens(this);
        // this.callCenterapi = new CallCenterApi(this, '');
        //this.guestApi = new GuestApi(this, 'tv/guest/');
        // this.messageHub = new MessageHub(this);
        // this.wsBridge = new WsBridge(this);
        //this.hostMan = HostMan.createHost(this.isDevelopment);
    }

    async init() {
        let { center } = this.props;
        let { center: centerDebug, uqDebug, uqs, res } = await buildHosts(center, this.isDevelopment);
        this.centerDebug = centerDebug;
        this.uqDebug = uqDebug;
        this.resDebug = res;
        if (uqs !== undefined) {
            for (let uq of uqs) {
                let { db } = uq;
                this.debugUqs.add(db.toLowerCase());
            }
        }
    }

    get fetchTimeout() {
        return this.isDevelopment === true ? 30000 : 50000;
    }

    get loginedUserId() {
        return this._loginedUserId;
    }

    createLocalMap(mapKey: string) {
        return this.localDb.createLocalMap(mapKey);
    }

    getLocalDbItem(itemKey: string) {
        return this.localDb.getItem(itemKey);
    }

    setLocalDbItem(itemKey: string, value: string) {
        this.localDb.setItem(itemKey, value);
    }

    getResUrl(res: string): string {
        return this.resDebug + res;
    }

    createObservableMap: () => Map<number, any>;

    logoutApis() {
        this.uqTokenApi.clearLocal();
        for (let i in this.uqChannels) this.uqChannels[i] = undefined;
    }

    setCenterToken(userId: number, token: string) {
        this._loginedUserId = userId;
        this.centerToken = token;
        this.centerChannel = undefined;
    }

    clearCenterToken() {
        this.setCenterToken(0, undefined);
    }

    getCenterChannel(): HttpChannel {
        if (this.centerChannel !== undefined) return this.centerChannel;
        return this.centerChannel = new HttpChannel(this, this.centerDebug, this.centerToken);
    }

    buildUqUrl(db: string, url: string, urlTest: string): string {
        let testOrProd: string;
        let dbToCheck = db.toLowerCase();
        if (this.testing === true) {
            url = urlTest;
            dbToCheck += '$test';
            testOrProd = 'test';
        }
        else {
            testOrProd = 'prod';
        }
        if (this.uqDebug) {
            if (this.debugUqs.has(dbToCheck) === true) {
                url = this.uqDebug;
            }
        }
        if (url.endsWith('/') === false) {
            url += '/';
        }
        return `${url}uq/${testOrProd}/${db}/`;
    }

    private isPromise(obj: any) {
        return (
            !!obj &&
            (typeof obj === "object" || typeof obj === "function") &&
            typeof obj.then === "function"
        );
    }

    async getHttpChannel(uq: string): Promise<HttpChannel> {
        let channel = this.uqChannels[uq];
        if (channel === undefined) {
            this.uqChannels[uq] = channel = new Promise(async (resolve, reject) => {
                let uqToken = await this.initUqToken(uq);
                let { url, token } = uqToken;
                this.uqChannels[uq] = channel = new HttpChannel(this, url, token);
                return resolve(channel);
            });
            return await channel;
        }

        if (this.isPromise(channel) === false) return channel as HttpChannel;
        return await (channel as Promise<HttpChannel>);
    }

    private async initUqToken(uq: string): Promise<UqToken> {
        let [uqOwner, uqName] = uq.split('/');
        let { unit } = this.props;
        let uqToken = await this.uqTokenApi.uq({ unit, uqOwner, uqName });
        if (uqToken.token === undefined) uqToken.token = this.centerToken;
        let { db, url, urlTest } = uqToken;
        let uqUrl = this.buildUqUrl(db, url, urlTest);
        console.log('realUrl: %s', uqUrl);
        uqToken.url = uqUrl;
        return uqToken;
    }
}
