import { PageQueryMore } from "app/coms";
import { useState } from "react";
import { SearchBox } from "tonwa-com";
import { UqQuery } from "tonwa-uq";

interface PageIDSelectProps {
    header: string;
    placeholder?: string;
    ItemView: ({ value }: { value: any }) => JSX.Element;
    onItemClick: (item: any) => Promise<void>;
    query: UqQuery<any, any>;
    autoOnOpen?: boolean;
}

export function PageIDSelect({ header, placeholder, query, ItemView, onItemClick, autoOnOpen }: PageIDSelectProps) {
    const [searchParam, setSearchParam] = useState(autoOnOpen === true ? { key: undefined as string } : undefined);
    const searchBox = <SearchBox className="px-3 py-2" onSearch={onSearch} placeholder={placeholder} />;
    async function onSearch(key: string) {
        setSearchParam({
            key
        });
    }
    return <PageQueryMore header={header}
        query={query}
        param={searchParam}
        sortField="id"
        ItemView={ItemView}
        onItemClick={onItemClick}
        pageSize={8}
        pageMoreSize={2}
    >
        {searchBox}
    </PageQueryMore>;
}
