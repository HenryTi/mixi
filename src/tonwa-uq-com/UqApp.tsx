import React, { ReactNode, useContext, useState } from 'react';
import { proxy, useSnapshot } from "valtio";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { AppNav, useEffectOnce } from 'tonwa-com';
import { Guest, LocalDb, NetProps, UqConfig, User, UserApi } from 'tonwa-uq';
import { createUQsMan, Net, UqUnit, Uq, UserUnit, UQsMan } from "tonwa-uq";
import { env, LocalData } from 'tonwa-com';
import { Spinner } from 'tonwa-com';
// import { AppNavContext } from 'tonwa-com';
import { StackContainer } from 'tonwa-com';
import { uqsProxy } from './uq';
import { AutoRefresh } from './AutoRefresh';
import { QueryClient, QueryClientProvider } from 'react-query';

export interface AppConfig { //extends UqsConfig {
    center: string;
    version: string;        // 版本变化，缓存的uqs才会重载
    loginTop?: JSX.Element;
    oem?: string;               // 用户注册发送验证码的oem厂家，默认同花
    privacy?: string;
    noUnit?: boolean;			// app的运行，不跟unit绑定
    htmlTitle?: string;
}

export interface RoleName {
    role?: string;
    caption: string;
    icon?: string;
    color?: string;
}

let uqAppId = 1;
export abstract class UqApp<U = any> {
    private readonly appConfig: AppConfig;
    private readonly uqConfigs: UqConfig[];
    private readonly uqsSchema: { [uq: string]: any; };
    //private readonly stores: Store[];          // 用于在同一个模块中传递
    private localData: LocalData;
    private roleNames: { [key: string]: RoleName };
    readonly uqAppBaseId: number;
    readonly net: Net;
    readonly appNav: AppNav;
    readonly userApi: UserApi;
    readonly version: string;    // version in appConfig;
    //readonly responsive: {
    //    user: User;
    //}
    readonly uqAppState: { user: User; };
    uqsMan: UQsMan;
    store: any;
    guest: number;
    uqs: U;
    // uq: Uq;
    uqUnit: UqUnit;

    constructor(appConfig: AppConfig, uqConfigs: UqConfig[], uqsSchema: { [uq: string]: any; }) {
        this.uqAppBaseId = uqAppId++;
        this.appConfig = appConfig;
        this.uqConfigs = uqConfigs;
        this.uqsSchema = uqsSchema;
        this.version = appConfig.version;
        /*
        this.responsive = proxy({
            user: undefined,
        });
        */
        // this.user = proxy({} as User);
        // this.stores = [];
        let props: NetProps = {
            center: appConfig.center,
            unit: env.unit,
            testing: env.testing,
            localDb: new LocalStorageDb(),
            createObservableMap: () => new Map(), //new ObservableMap(),
        }
        this.net = new Net(props);
        this.localData = new LocalData();

        this.appNav = new AppNav();
        this.userApi = this.net.userApi;
        let user = this.localData.user.get();
        this.uqAppState = proxy({
            user,
        });
    }

    protected get defaultUqRoleNames(): { [lang: string]: any } { return undefined }
    loginUnit(userUnit: UserUnit) {
        this.uqUnit.loginUnit(userUnit);
    }
    logoutUnit() {
        this.uqUnit.logoutUnit();
    }
    get userUnit() { return this.uqUnit.userUnit; }
    // get me() { return this.user.read().user.read() return this.responsive.user?.id; }
    hasRole(role: string[] | string): boolean {
        if (this.uqUnit === undefined) return false;
        return this.uqUnit.hasRole(role);
    }

    logined(user: User) {
        this.net.logoutApis();
        this.uqAppState.user = user;
        let autoLoader: Promise<any> = undefined;
        let autoRefresh = new AutoRefresh(this, autoLoader);
        if (user) {
            jwtDecode(user.token);
            this.net.setCenterToken(user.id, user.token);
            /*
            if (this.uq !== undefined) {
                this.uqUnit = new UqUnit(this.uq as any);
                await this.uqUnit.loadMyRoles();
                autoRefresh.start();
            }
            */
            this.appNav.onLogined(true);
        }
        else {
            this.net.clearCenterToken();
            this.uqUnit = undefined;
            autoRefresh.stop();
            this.appNav.onLogined(false);
        }
        this.localData.user.set(user);
    }

    async setUserProp(propName: string, value: any) {
        await this.userApi.userSetProp(propName, value);
        (this.uqAppState.user as any)[propName] = value;
        this.localData.user.set(this.uqAppState.user);
    }

    saveLocalData() {
        this.localData.saveToLocalStorage();
    }

    // private initCalled = false;
    initErrors: string[];
    init(initPage: React.ReactNode, navigateFunc: NavigateFunction): void {
        this.appNav.init(initPage, navigateFunc);
    }

    async load(): Promise<void> {
        // if (this.initCalled === true) return;
        // this.initCalled = true;
        await this.net.init();
        try {
            let uqsMan = await createUQsMan(this.net, this.appConfig.version, this.uqConfigs, this.uqsSchema);
            this.uqsMan = uqsMan;
            this.uqs = uqsProxy(uqsMan) as U;

            if (this.uqs) {
                // this.uq = this.defaultUq;
                // this.buildRoleNames();
            }
            // let user = this.localData.user.get();
            let { user } = this.uqAppState;
            this.logined(user);
            if (!user) {
                let guest: Guest = this.localData.guest.get();
                if (guest === undefined) {
                    guest = await this.net.userApi.guest();
                }
                if (!guest) {
                    throw Error('guest can not be undefined');
                }
                this.net.setCenterToken(0, guest.token);
                this.localData.guest.set(guest);
                await this.loadedBeforeLogin();
            }
            else {
                await this.loadAfterLogin();
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    protected loadAfterLogin(): Promise<void> {
        return;
    }

    protected loadedBeforeLogin(): Promise<void> {
        return;
    }

    /*
    private buildRoleNames() {
        if (this.uq === undefined) return;
        let defaultUqRoleNames = this.defaultUqRoleNames;
        if (defaultUqRoleNames !== undefined) {
            this.roleNames = defaultUqRoleNames[env.lang];
            if (this.roleNames === undefined) {
                this.roleNames = defaultUqRoleNames['$'];
            }
        }
        if (this.roleNames === undefined) this.roleNames = {};
    }

    roleName(role: string): RoleName {
        return this.roleNames[role];
    }
    */
}

class LocalStorageDb extends LocalDb {
    getItem(key: string): string {
        return localStorage.getItem(key);
    }
    setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }
    removeItem(key: string): void {
        localStorage.removeItem(key);
    }
}

export const UqAppContext = React.createContext(undefined);
export function useUqAppBase() {
    return useContext<UqApp>(UqAppContext);
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            suspense: true,
        },
    },
});

function UqAppViewBase({ uqApp, user, children }: { uqApp: UqApp; user: User; children: ReactNode; }) {
    let { appNav } = uqApp;
    let [appInited, setAppInited] = useState<boolean>(false);
    let { stack } = useSnapshot(appNav.data);
    // let user = useSnapshot(uqApp.user);
    useEffectOnce(() => {
        (async function () {
            await uqApp.load();
            setAppInited(true);
        })();
    }/*, [uqApp, children, navigateFunc]*/);
    let navigateFunc = useNavigate();
    appNav.init(children, navigateFunc);
    if (appInited === false) {
        return <div className="p-5 text-center">
            <Spinner className="text-info" />
        </div>;
    }
    if (uqApp.initErrors) {
        return <div>
            <div>uq app start failed. init errors: </div>
            <ul className="text-danger">
                {
                    uqApp.initErrors.map((v: string, index: number) => <li key={index}>{v}</li>)
                }
            </ul>
        </div>;
    }
    return <UqAppContext.Provider value={uqApp}>
        <QueryClientProvider client={queryClient}>
            <StackContainer stackItems={stack} />
            {user !== undefined}
        </QueryClientProvider>
    </UqAppContext.Provider>;
}

function UqAppViewLogined({ uqApp, user, children }: { uqApp: UqApp; user: User; children: ReactNode; }) {
    return <UqAppViewBase uqApp={uqApp} user={user} children={children} />
}

function UqAppViewUnlogined({ uqApp, children }: { uqApp: UqApp; children: ReactNode; }) {
    return <UqAppViewBase uqApp={uqApp} user={undefined} children={children} />
}

export function UqAppView({ uqApp, children }: { uqApp: UqApp; children: ReactNode; }) {
    let { user } = useSnapshot(uqApp.uqAppState);
    if (user === undefined) {
        return <UqAppViewUnlogined uqApp={uqApp} children={children} />;
    }
    else {
        return <UqAppViewLogined uqApp={uqApp} user={user as User} children={children} />;
    }
}
