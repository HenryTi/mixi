import { useNav, Page } from "../page";
import { List } from '../list';

export interface PickPagePropsBase<T> {
    header: string | JSX.Element;
    className?: string;
    ItemView: (props: { value: T; }) => JSX.Element;
    top?: JSX.Element;
    bottom?: JSX.Element;
}

interface PickPageProps<T> extends PickPagePropsBase<T> {
    items: T[];
}

export function PickPage<T>({ header, className, ItemView, items, top, bottom }: PickPageProps<T>) {
    let nav = useNav();
    function onItemClick(item: T): Promise<void> {
        nav.returnCall(item);
        return;
    }
    return <Page header={header}>
        {top}
        <List className={className ?? 'my-1 border-top border-bottom border-2'}
            items={items}
            ItemView={ItemView}
            onItemClick={onItemClick} />
        {bottom}
    </Page>
}
