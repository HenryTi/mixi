import { useCallback, useEffect, useState } from "react";
import { List, Page, SearchBox, useNav } from "tonwa-com";
import { ID, Uq } from "tonwa-uq";

interface Props<T = any> {
    Row: (props: { value: T; }) => JSX.Element;
    header?: string | JSX.Element;
    query: ((key: string) => Promise<T[]>) | {
        uq: Uq;
        ID: ID;
    };
}

export function IDSelect<T>({ header, Row, query }: Props) {
    let nav = useNav();
    let [items, setItems] = useState<T[]>(undefined);
    let search = useCallback(async function (key: string) {
        let ret: T[];
        switch (typeof (query)) {
            case 'function':
                ret = await query(key);
                break;
            case 'object':
                let { uq, ID } = query;
                ret = await uq.QueryID<T>({ ID });
                break;
        }
        setItems(ret);
    }, [query]);
    useEffect(() => {
        search(undefined);
    }, [search]);
    function onItemClick(item: T) {
        nav.returnCall(item);
        nav.close(0);
    }
    let right = <SearchBox className="me-2" onSearch={search} />;
    function RowDefault({ value }: { value: T; }) {
        return <div className="px-3 py-2">{JSON.stringify(value)}</div>;
    }
    return <Page header={header ?? 'Select'} right={right}>
        <List items={items} ItemView={Row ?? RowDefault} onItemClick={onItemClick} />
    </Page>;
}
