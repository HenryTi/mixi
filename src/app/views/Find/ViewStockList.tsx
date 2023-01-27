import { ViewStockRow } from "app/coms/ItemViewStock";
import { List, useNav } from "tonwa-com";
import { Stock, StockValue } from "uqs/BrMi";
import { PageStockInfo } from "../StockInfo";

interface ViewStockListProps {
    stocks: (Stock & StockValue)[];
    renderRowRight?: (stock: Stock & StockValue) => JSX.Element;
    onClickName?: (stock: Stock & StockValue) => void;
}

interface ItemViewStockProps {
    value: Stock & StockValue;
    //renderRowRight?: (stock: Stock & StockValue) => JSX.Element;
}

export function ItemViewStock({ value }: ItemViewStockProps) {
    let nav = useNav();
    function onClick() {
        nav.open(<PageStockInfo stock={value} />);
    }
    function renderRowRight(value: Stock & StockValue): JSX.Element {
        return null;
    }
    return <ViewStockRow order={(value as any)['$order']}
        stock={value} onClickName={onClick} right={renderRowRight(value)} />
}

export function ViewStockList({ stocks, renderRowRight, onClickName }: ViewStockListProps) {
    renderRowRight = renderRowRight ?? function (stock: Stock & StockValue) {
        return <>right</>;
    };
    return <List items={stocks} ItemView={ItemViewStock} />;
}
