import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useState } from "react";
import { SearchBox } from "tonwa-com";
import { PartsProps } from "../Parts";
import { IDParts } from "./IDParts";

/*
interface PageIDSelectProps {
    header: string;
    placeholder?: string;
    ItemView: ({ value }: { value: any }) => JSX.Element;
    onItemClick: (item: any) => Promise<void>;
    query: UqQuery<any, any>;
    autoLoadOnOpen?: boolean;   // auto load data on open
}
*/
export function PageIDSelect({ Parts, onItemClick }: PartsProps<IDParts> & { onItemClick: (item: any) => Promise<void>; }) {
    const uqApp = useUqApp();
    const { caption, placeholder, query, ViewItem, autoLoadOnOpen } = uqApp.fromCache(Parts);

    const [searchParam, setSearchParam] = useState(autoLoadOnOpen === true ? { key: undefined as string } : undefined);
    const searchBox = <SearchBox className="px-3 py-2" onSearch={onSearch} placeholder={placeholder} />;
    async function onSearch(key: string) {
        setSearchParam({
            key
        });
    }
    return <PageQueryMore header={`选择${caption}`}
        query={query}
        param={searchParam}
        sortField="id"
        ViewItem={ViewItem}
        onItemClick={onItemClick}
        pageSize={8}
        pageMoreSize={2}
    >
        {searchBox}
    </PageQueryMore>;
}
