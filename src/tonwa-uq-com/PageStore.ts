import { useContext } from 'react';
import { Nav, useNav } from "tonwa-com";
import { UqApp, UqAppContext } from "./UqApp";

export abstract class PageStore<UQApp extends UqApp<UQS> = any, UQS = any, P = any> {
    private _uqApp: UQApp;
    get uqApp(): UQApp { return this._uqApp; }
    protected uqs: UQS;
    protected nav: Nav;
    parent: P;
    private initOncePromise: Promise<void> | any;
    setUqAppAndParent(uqApp: UQApp, nav: Nav) {
        this._uqApp = uqApp;
        this.uqs = uqApp.uqs;
        this.nav = nav;
        let parent = nav.getPageStore();
        this.parent = parent as P;
    }
    initOnce(): Promise<void> {
        if (this.initOncePromise === undefined) {
            this.initOncePromise = new Promise<void>((resolve, reject) => {
                this.init()
                    .then(() => {
                        this.initOncePromise = null;
                        resolve();
                    })
                    .catch(reason => {
                        this.initOncePromise = reason;
                        reject(reason);
                    })
            });
        }
        return this.initOncePromise;
    }

    async init(): Promise<void> {
    }
}

export function usePageStoreInit<T extends PageStore>(initStore: () => T): T {
    let nav = useNav();
    let uqApp = useContext<UqApp>(UqAppContext);
    let store: T = nav.getPageTopStore();
    if (store === undefined) {
        store = initStore();
        store.setUqAppAndParent(uqApp, nav);
        nav.setPageStore(store);
    }
    let ret = store.initOnce();
    if (ret !== null) throw ret;
    return store;
}

export function useInitPageStore<T extends PageStore>(initStore: () => T): T {
    return usePageStoreInit<T>(initStore);
}

export function usePageStore<T extends PageStore>() {
    let nav = useNav();
    let store = nav.getPageStore() as T;
    if (store === undefined) throw new Error('store in uqApp is not inited');
    return store;
}
