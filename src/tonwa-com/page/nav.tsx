import React, { useContext } from "react";
import { Spinner } from "../coms";
import { proxy, ref } from "valtio";
import { AppNav, TabNav } from "./AppNav";
import { UPage } from "./Page";
import { useUqAppBase } from "tonwa-uq-com";

export interface StackItem {
    key: string;
    page: JSX.Element;
    store?: any;
    tab?: any;
    onClose?: () => boolean;
    nav?: any;
}

export interface TabItem extends StackItem {
    title: string;
    keep?: boolean;
}

export class StackNav<T extends StackItem> {
    readonly data: {
        stack: T[];
    };
    private stackLen: number = 0;
    private callStack: ((value: any | PromiseLike<any>) => void)[] = [];
    private pageKeyNO: number;
    constructor() {
        this.pageKeyNO = 0;
        this.data = proxy({
            stack: [],
        });
    }

    setPageStore(store: any) {
        if (this.stackLen > 0) {
            let page = this.data.stack[this.stackLen - 1];
            let { tab } = page;
            if (tab) {
                tab.store = store;
            }
            else {
                page.store = store;
            }
        }
    }

    setPageTab(tab: any) {
        if (this.stackLen > 0) {
            this.data.stack[this.stackLen - 1].tab = tab;
        }
    }

    getPageTopStore(): any {
        if (this.stackLen > 0) {
            let { stack } = this.data;
            let page = stack[this.stackLen - 1];
            let { tab } = page;
            if (tab) {
                return tab.store;
            }
            else {
                return page.store;
            }
        }
    }

    getPageStore(): any {
        let { stack } = this.data;
        for (let i = this.stackLen - 1; i >= 0; i--) {
            let { store, tab } = stack[i];
            if (tab) return tab.store;
            if (store !== undefined) return store;
        }
    }

    open(page: JSX.Element | (() => Promise<JSX.Element>), onClose?: () => boolean): void {
        if (typeof (page) === 'function') {
            let promise: Promise<JSX.Element> = page();
            let isWaiting = false;
            setTimeout(() => {
                if (isWaiting === undefined) return;
                this.internalOpen(<Waiting />);
                isWaiting = true;
            }, 100);
            promise.then(pg => {
                if (isWaiting === true) {
                    this.close();
                }
                isWaiting = undefined;
                this.internalOpen(pg, onClose);
                return;
            });
            return;
        }
        this.internalOpen(page, onClose);
    }

    protected internalOpen(page: JSX.Element, onClose?: () => boolean): void {
        this.innerClose();
        let pageItem = {
            key: String(++this.pageKeyNO),
            page, onClose,
        } as T;
        this.data.stack.push(ref(pageItem));
        this.stackLen = this.data.stack.length
    }

    close(level: number = 1) {
        this.stackLen -= level;
        this.innerClose();
        //for (let i = 0; i < level; i++) this.innerClose();
    }

    cease(level: number = 1) {
        this.stackLen -= level;
    }

    call<T>(page: JSX.Element | (() => Promise<JSX.Element>)): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.callStack.push(resolve);
            this.open(page);
        });
    }

    returnCall<T>(returnValue: T) {
        let resolve = this.callStack.pop();
        if (resolve === undefined) {
            console.error('nav.call and nav.returnCall not matched');
            return;
        }
        this.cease();
        resolve(returnValue);
    }

    async confirm(msg: string): Promise<boolean> {
        return window.confirm(msg);
    }

    clear() {
        alert('nav clear');
    }

    protected innerClose() {
        let { stack } = this.data;
        let len = stack.length;
        if (len === 0) {
            this.stackLen = 0;
            return;
        }
        if (this.stackLen < 0) this.stackLen = 0;
        let stackLen = this.stackLen;
        for (let i = len - 1; i >= stackLen; i--) {
            let { onClose } = stack[i];
            if (onClose?.() === false) return;
            stack.pop();
        }
    }
}

export function Waiting() {
    return <UPage header="..." back="none" headerClassName="bg-secondary">
        <div className="px-5 py-5 text-info text-center">
            <Spinner />
        </div>
    </UPage>;
}

export class Nav extends StackNav<StackItem> {
    private static seed = 1;
    private initPage: React.ReactNode;
    readonly appNav: AppNav;
    readonly tabNav: TabNav;
    readonly id: number;

    constructor(appNav: AppNav, tabNav: TabNav) {
        super();
        this.appNav = appNav;
        this.tabNav = tabNav;
        this.id = Nav.seed++;
    }

    setInitPage(initPage: React.ReactNode) {
        if (!initPage) return;
        if (this.initPage) return;
        this.initPage = initPage;
        this.internalOpen(initPage as JSX.Element);
    }

    openTab(tabItem: TabItem) {
        this.tabNav.openTab(tabItem);
    }

    protected innerClose() {
        super.innerClose();
        if (this.data.stack.length > 0) return;
        if (this.tabNav) {
            this.tabNav.closeTab();
        }
        else {
            //this.appNav.close();
            this.appNav.cease();
        }
    }
}

// export const AppNavContext = React.createContext<AppNav>(undefined);
//export const TabNavContext = React.createContext<TabNav>(undefined);
export const PageStackContext = React.createContext<Nav>(undefined);

export function useAppNav() {
    let uqApp = useUqAppBase();
    return uqApp.appNav;
    // return useContext(AppNavContext);
}

export function useTabNav() {
    let uqApp = useUqAppBase();
    return uqApp.appNav.tabNav;
    // return useContext(TabNavContext);
}

export function useNav() {
    return useContext(PageStackContext);
}
