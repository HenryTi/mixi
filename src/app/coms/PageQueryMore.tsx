import { useEffect, useRef, useState } from "react";
import { List, Spinner, useEffectOnce } from "tonwa-com";
import { UqQuery } from "tonwa-uq";
import { Page, PageProps, Scroller } from "tonwa-app";

interface PageQueryMoreProps<P, R> extends PageProps {
    query: UqQuery<P, R>;
    param: P;
    sortField: string;
    pageStart?: any;
    pageSize?: number;
    ItemView?: ({ value }: { value: any; }) => JSX.Element;
    onItemClick?: (item: any) => Promise<void>;
    tickReload?: number;
}

export function PageQueryMore<P, R>(props: PageQueryMoreProps<P, R>) {
    let { query, param, sortField, pageStart: pageStartParam, pageSize, ItemView, onItemClick, children, tickReload } = props;
    const [items, setItems] = useState<R[]>(undefined);
    const [loading, setLoading] = useState(false);
    const pageStart = useRef(pageStartParam);
    pageSize = pageSize ?? 30;
    //let isLoadingInOneRender = false;
    async function callQuery() {
        if (loading === true) return;
        // if (loading === true || isLoadingInOneRender === true) return;
        //isLoadingInOneRender = true
        //if (items !== undefined) 
        setLoading(true);
        let ret = await query.page(param, pageStart.current, pageSize);
        let { $page } = ret as any;
        let { length } = $page;
        if (length === 0) return;
        setItems(pageStart.current === undefined || items === undefined ? $page : [...items, ...$page]);
        pageStart.current = $page[length - 1][sortField];
        setLoading(false);
        //isLoadingInOneRender = false;
    }
    useEffect(() => {
        pageStart.current = undefined;
        callQuery();
        console.log('PageQueryMore useEffect ', pageStartParam);
    }, [tickReload]);
    useEffectOnce(() => {
        callQuery();
    });
    let scrolling = false;
    function scrollIntoView(divId: string) {
        setTimeout(() => {
            let div = document.getElementById(divId);
            div?.scrollIntoView();
            scrolling = false;
        }, 20);
    }
    async function onScrollBottom(scroller: Scroller) {
        if (scrolling === true) return;
        scrolling = true;
        scrollIntoView('$$bottom');
        await callQuery();
        // scrollIntoView('$$bottom');
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
