import { useCallback, useEffect, useRef, useState } from "react";
import { List, Spinner, useEffectOnce } from "tonwa-com";
import { UqQuery } from "tonwa-uq";
import { Page, PageProps, Scroller } from "tonwa-app";
import { useNavigationType } from "react-router-dom";
import { useUqApp } from "app/UqApp";

interface PageQueryMoreProps<P, R> extends PageProps {
    query: UqQuery<P, R>;
    param: P;
    sortField: string;
    pageStart?: any;
    pageSize?: number;
    pageMoreSize?: number;
    ItemView?: ({ value }: { value: any; }) => JSX.Element;
    onItemClick?: (item: any) => Promise<void>;
    tickReload?: number; // 改变这个值，会引发重新load数据
}

export class PageMoreCacheData {
    start: any;
    items: any[];
    constructor(start: any, items: any[]) {
        this.start = start;
        this.items = items;
    }

    getItem<T>(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined {
        return this.items.find(predicate);
    }
}

export function PageQueryMore<P, R>(props: PageQueryMoreProps<P, R>) {
    let { query, param, sortField, pageStart: pageStartParam, pageSize, pageMoreSize, ItemView, onItemClick, children, tickReload } = props;
    const [items, setItems] = useState<R[]>(undefined);
    const [loading, setLoading] = useState(false);
    const navAction = useNavigationType();
    const refValue = useRef({
        pageStart: pageStartParam,
        isPopFirst: navAction === 'POP',
        querying: false,
        items: undefined as any[],
    });
    const { current } = refValue;
    pageSize = pageSize ?? 20;
    pageMoreSize = pageMoreSize ?? 5;
    const uqApp = useUqApp();
    const { pathname } = document.location;
    let urlCache = uqApp.pageCache.get<PageMoreCacheData>(pathname);
    const callQuery = useCallback(async function callQuery(more: boolean = false) {
        let { pageStart, querying, isPopFirst, items } = current;
        if (isPopFirst === true) {
            if (urlCache) {
                let { start } = urlCache.data;
                if (start === pageStart && items !== undefined) return;
            }
        }
        if (querying === true) return;
        if (loading === true) return;
        setLoading(true);
        current.querying = true;
        let arrResult: any[];
        if (current.isPopFirst === true) {
            setTimeout(() => {
                current.isPopFirst = false;
            }, 100);
            if (pageStart === pageStartParam && urlCache) {
                let { items: result } = urlCache.data;
                arrResult = result;
                uqApp.pageCache.setData(pathname, undefined);
            }
        }
        if (!arrResult) {
            let ret = await query.page(param, pageStart, more === true ? pageMoreSize : pageSize);
            let { $page } = ret as any;
            arrResult = $page;
        }
        let { length } = arrResult;
        let newItems = pageStart === undefined || items === undefined ? arrResult : [...items, ...arrResult];
        setItems(newItems);
        current.items = newItems;
        if (length > 0) {
            current.pageStart = arrResult[length - 1][sortField];
        }
        uqApp.pageCache.setData<PageMoreCacheData>(pathname, new PageMoreCacheData(pageStart, newItems));
        setLoading(false);
        current.querying = false;
    }, []);
    useEffectOnce(() => {
        callQuery();
    });
    useEffect(() => {
        if (current.isPopFirst === true) return;
        current.pageStart = undefined;
        callQuery();
    }, [tickReload]);
    let scrolling = false;
    function scrollIntoView(divId: string) {
        setTimeout(() => {
            let div = document.getElementById(divId);
            div?.scrollIntoView();
            scrolling = false;
        }, 20);
    }
    async function onScrollBottom(scroller: Scroller) {
        if (current.isPopFirst === true) return;
        if (scrolling === true) return;
        scrolling = true;
        scrollIntoView('$$bottom');
        await callQuery(true);
    }
    ItemView = ItemView ?? function ({ value }: { value: R; }) {
        return <>{JSON.stringify(value)}</>;
    }
    return <Page {...props} onScrollBottom={onScrollBottom}>
        <div id="$$top" />
        {children}
        <List items={items} ItemView={ItemView} onItemClick={onItemClick} />
        {loading && items !== undefined && <div>
            <Spinner className="m-3 text-info" />
            <div id="$$bottom" />
        </div>
        }
    </Page>;
}
