import { useEffect, useState } from "react";
import { PickPage, PickPagePropsBase } from "./PickPage";

export type ItemsQuery<T> = (param?: string, pageStart?: any, pageSize?: number) => Promise<T[]>;

export interface PickQueryPageProps<T> extends PickPagePropsBase<T> {
    query: ItemsQuery<T>;
    allowSearch?: boolean;
    allowNew?: boolean;
    pagination?: 'none' | 'infinite' | 'next';
}

export function PickQueryPage<T>(props: PickQueryPageProps<T>) {
    let { query } = props;
    let [items, setItems] = useState<T[]>(undefined);
    useEffect(() => {
        async function load() {
            let ret = await query();
            setItems(ret);
        }
        load();
    }, [query]);
    return <PickPage {...props} items={items} />;
}
