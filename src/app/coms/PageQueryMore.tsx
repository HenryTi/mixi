import { useEffect, useRef, useState } from "react";
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

export function PageQueryMore<P, R>(props: PageQueryMoreProps<P, R>) {
    let { query, param, sortField, pageStart: pageStartParam, pageSize, pageMoreSize, ItemView, onItemClick, children, tickReload } = props;
    const [items, setItems] = useState<R[]>(undefined);
    const [loading, setLoading] = useState(false);
    const pageStart = useRef(pageStartParam);
    const navAction = useNavigationType();
    const isPopFirst = useRef(navAction === 'POP');
    pageSize = pageSize ?? 20;
    pageMoreSize = pageMoreSize ?? 5;
    const uqApp = useUqApp();
    const { pathname } = document.location;
    async function callQuery(more: boolean = false) {
        let pageStartValue = pageStart.current;
        let urlCache = uqApp.getUrlCache(pathname);
        if (isPopFirst.current === true) {
            if (urlCache) {
                let { start } = urlCache.data;
                if (start === pageStartValue) return;
            }
        }
        if (loading === true) return;
        setLoading(true);
        let arrResult: any[];
        if (isPopFirst.current === true) {
            setTimeout(() => {
                isPopFirst.current = false;
            }, 100);
            if (pageStartValue === pageStartParam && urlCache) {
                let { result } = urlCache.data;
                arrResult = result;
                uqApp.setUrlCacheData(pathname, undefined);
            }
        }
        if (!arrResult) {
            let ret = await query.page(param, pageStartValue, more === true ? pageMoreSize : pageSize);
            let { $page } = ret as any;
            arrResult = $page;
        }
        let { length } = arrResult;
        let newItems = pageStart.current === undefined || items === undefined ? arrResult : [...items, ...arrResult];
        setItems(newItems);
        if (length > 0) {
            pageStart.current = arrResult[length - 1][sortField];
        }
        uqApp.setUrlCacheData(pathname, { result: newItems, start: pageStart.current });
        setLoading(false);
    }
    useEffectOnce(() => {
        callQuery();
    });
    useEffect(() => {
        if (isPopFirst.current === true) return;
        pageStart.current = undefined;
        callQuery();
        console.log('PageQueryMore useEffect ', pageStartParam);
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
        if (isPopFirst.current === true) return;
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
