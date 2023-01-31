import { ViewStockRow } from "app/coms/ItemViewStock";
import { useUqApp } from "app/MyUqApp";
import { useNavigate } from "react-router-dom";
import { List, useNav } from "tonwa-com";
import { Stock, StockValue } from "uqs/BrMi";
import { PageStockInfo } from "../StockInfo";
import { toStock } from "../StockInfo/routeStock";

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
    //let nav = useNav();
    const { storeApp } = useUqApp();
    const navigate = useNavigate();
    function onClick() {
        storeApp.stock = value;
        navigate(toStock(value.id));
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
