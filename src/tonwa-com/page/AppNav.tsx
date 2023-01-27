import React from "react";
import { NavigateFunction, NavigateOptions, To } from "react-router-dom";
import { proxy, ref } from "valtio";
import { Nav, StackItem, StackNav, TabItem } from "./nav";

interface ErrorInPage {
    err: string; // name unique
    message: string;
}

export class AppNav extends StackNav<StackItem> {
    readonly response: {
        isLogined: boolean;
        error: ErrorInPage;
    } = proxy({
        isLogined: undefined,
        error: undefined,
    });
    readonly tabNav = new TabNav(this);

    private navigateFunc: NavigateFunction;

    init(initPage: React.ReactNode, navigateFunc: NavigateFunction) {
        if (this.navigateFunc) return;
        this.navigateFunc = navigateFunc;
        if (initPage) {
            this.data.stack.splice(0);
            this.internalOpen(<>{initPage}</>);
        }
    }

    navigate(to: To, options?: NavigateOptions) {
        this.navigateFunc(to, options);
    }

    onLogined = (isLogined: boolean) => {
        if (isLogined === true) {
            this.response.isLogined = isLogined;
        }
        else {
            this.response.isLogined = false;
        }
        this.response.error = undefined;
    }
    setError(err: string, message: string) { this.response.error = ref({ err, message }) }
    clearError() { this.response.error = undefined; }

    createNav = (): Nav => {
        return new Nav(this, this.tabNav);
    }
}

export class TabNav extends StackNav<TabItem> {
    readonly appNav: AppNav;
    readonly itemsArr: TabItem[];
    readonly response: {
        active: TabItem;
    }
    defaultActive: TabItem;

    constructor(appNav: AppNav) {
        super();
        this.appNav = appNav;
        this.itemsArr = [];
        this.response = proxy({
            active: undefined,
        });
    }

    setInitTabs(initPageItems: TabItem[], defaultActive: TabItem) {
        this.defaultActive = defaultActive;
        initPageItems = initPageItems ?? [];
        this.itemsArr.splice(0);
        this.itemsArr.push(...initPageItems);
        this.data.stack.splice(0);
        this.data.stack.push(...(initPageItems).map(v => ref(v)));
    }

    openTab(pageItem: TabItem) {
        let refPageItem = ref(pageItem);
        this.response.active = refPageItem;
        this.data.stack.push(refPageItem);
        this.itemsArr.push(pageItem);
        this.appNav.navigate(`/${pageItem.key}`);
    }

    activate(pageItem: TabItem) {
        let { key: name } = pageItem;
        if (this.response.active !== pageItem) {
            this.response.active = pageItem;
            let p = this.itemsArr.findIndex(v => v.key === name);
            let ret = this.itemsArr.splice(p, 1);
            this.itemsArr.push(...ret);
            this.appNav.navigate(name);
        }
    }

    closeTab(pageItem?: TabItem) {
        let { stack } = this.data;
        if (stack.length === 0) return;
        pageItem = pageItem ?? this.response.active;
        let p = stack.findIndex(v => v === pageItem);
        if (p >= 0) {
            let [item] = stack.splice(p, 1);
            let i = this.itemsArr.findIndex(v => v.key === item.key);
            if (i >= 0) this.itemsArr.splice(i, 1)
            let len = this.itemsArr.length;
            if (len > 0) {
                let item = this.itemsArr[len - 1];
                this.response.active = item;
                let active = item.key;
                this.appNav.navigate(`/${active}`);
            }
        }
    }
}
