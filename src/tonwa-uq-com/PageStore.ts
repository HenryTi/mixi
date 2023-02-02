import { useNav } from "tonwa-com";
import { UqApp } from "./UqApp";

export abstract class PageStore<UQApp extends UqApp<UQS> = any, UQS = any, P = any> {
    private _uqApp: UQApp;
    get uqApp(): UQApp { return this._uqApp; }
    protected uqs: UQS;
    // protected nav: Nav;
    parent: P;
    constructor(uqApp: UQApp) {
        this._uqApp = uqApp;
    }

    async init(): Promise<void> {
    }
}

export function usePageStoreInit<T extends PageStore>(initStore: () => T): T {
    let nav = useNav();
    let store: T = nav.getPageTopStore();
    if (store === undefined) {
        store = initStore();
        nav.setPageStore(store);
    }
    let ret = store.init();
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
