import { PageQueryMoreModal } from "app/coms";
import { useState } from "react";
import { SearchBox } from "tonwa-com";
import { UqQuery } from "tonwa-uq";

interface PageIDSelectProps {
    header: string;
    placeholder?: string;
    ItemView: ({ value }: { value: any }) => JSX.Element;
    onItemClick: (item: any) => Promise<void>;
    query: UqQuery<any, any>;
}

export function PageIDSelect({ header, placeholder, query, ItemView, onItemClick }: PageIDSelectProps) {
    const [searchParam, setSearchParam] = useState({ key: undefined as string });
    const right = <SearchBox onSearch={onSearch} placeholder={placeholder} />;
    async function onSearch(key: string) {
        setSearchParam({
            key
        });
    }
    return <PageQueryMoreModal header={header} right={right}
        query={query}
        param={searchParam}
        sortField="id"
        ItemView={ItemView}
        onItemClick={onItemClick}
        pageSize={4}
        pageMoreSize={1}
    >
    </PageQueryMoreModal>;
}
