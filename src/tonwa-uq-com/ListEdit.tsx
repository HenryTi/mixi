import { useRef } from "react";
import { List, ListPropsWithoutItems } from "tonwa-com";
import { proxy, useSnapshot } from "valtio";

interface Props<T> extends ListPropsWithoutItems<T> {
    context: ListEditContext<T>;
}

export class ListEditContext<T> {
    private readonly response: { items: T[]; };
    private readonly keyCompareFunc: (item1: T, item2: T) => boolean;
    constructor(items: T[], keyCompare: string | ((item1: T, item2: T) => boolean)) {
        this.response = proxy({ items });
        this.keyCompareFunc = (typeof keyCompare === 'string') ?
            (item1: T, item2: T) => (item1 as any)[keyCompare] === (item2 as any)[keyCompare]
            :
            keyCompare;
    }

    protected keyCompare(item1: T, item2: T): boolean {
        return this.keyCompareFunc(item1, item2);
    }

    setItems(items: T[]) {
        this.response.items = items;
    }
    get items() { return this.response.items; }
    getResponse() { return this.response; }

    private findIndex(item: T): number {
        let { items } = this.response;
        let p = items.findIndex(v => this.keyCompare(v, item));
        return p;
    }

    onItemChanged(item: T) {
        let p = this.findIndex(item);
        let { items } = this.response;
        if (p >= 0) {
            Object.assign(items[p], item);
        }
        else {
            items.unshift(item);
        }
    }

    onItemDeleted(item: T) {
        let p = this.findIndex(item);
        if (p >= 0) this.response.items.splice(p, 1);
    }

    moveItemToFirst(item: T) {
        let p = this.findIndex(item);
        if (p >= 0) this.response.items.splice(p, 1);
        this.response.items.unshift(item);
    }

    moveItemToLast(item: T) {
        let p = this.findIndex(item);
        if (p >= 0) this.response.items.splice(p, 1);
        this.response.items.push(item);
    }
}

export function ListEdit<T>(props: Props<T>) {
    let { context } = props;
    let { items } = useSnapshot(context.getResponse());
    return <List {...props} items={items as any} />;
}

export function useListEdit<T>(items: T[], keyCompare: (item1: T, item2: T) => boolean) {
    let { current } = useRef(new ListEditContext<T>(items, keyCompare));
    return current;
}
