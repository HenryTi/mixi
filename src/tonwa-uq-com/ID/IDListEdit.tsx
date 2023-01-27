import { useRef } from "react";
import { useSnapshot } from "valtio";
import { List, ListPropsWithoutItems } from "tonwa-com";
import { ListEditContext } from "../ListEdit";

interface Props<T extends { id?: number; }> extends ListPropsWithoutItems<T> {
    context: IDListEditContext<T>;
}

export class IDListEditContext<T extends { id?: number; }> extends ListEditContext<T> {
    constructor(items: T[]) {
        super(items, undefined)
    }

    protected keyCompare(item1: T, item2: T): boolean {
        return item1.id === item2.id;
    }
}

export function IDListEdit<T extends { id?: number; }>(props: Props<T>) {
    let { context } = props;
    let { items } = useSnapshot(context.getResponse());
    return <List {...props} items={items as any} />;
}

export function useIdListEdit<T>(items: T[]) {
    let { current } = useRef(new IDListEditContext<T>(items));
    return current;
}
