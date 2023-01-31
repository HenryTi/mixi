import { useUqApp } from "app/MyUqApp";
import { Stock, StockValue } from "uqs/BrMi";

export interface ButtonBlockStockProps {
    stock: Stock & StockValue;
    isBlock: boolean;
}

export function ButtonBlockStock({ stock, isBlock }: ButtonBlockStockProps) {
    const uqApp = useUqApp();
    const { storeApp } = uqApp;
    let cn: string, content: string;
    if (isBlock === true) {
        content = '取消拉黑';
        cn = 'btn-outline-danger';
    }
    else {
        content = '拉黑';
        cn = 'btn-outline-secondary';
    }
    return <button className={'btn btn-sm align-self-start ' + cn}
        onClick={() => storeApp.toggleBlock(stock)}>
        {content}
    </button>;
}
