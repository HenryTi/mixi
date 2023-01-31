import { useUqApp } from "app/MyUqApp";
import { FA } from "tonwa-com";
import { Stock, StockValue } from "uqs/BrMi";

export function ButtonPinStock({ stock, closeLevelWhenRemoved }: { stock: Stock & StockValue; closeLevelWhenRemoved: number; }) {
    const { storeApp } = useUqApp();
    let isSelected = storeApp.isMyAll(stock);
    if (isSelected === true) {
        /*
        return <DropdownActions actions={[
            {
                caption: '修改分组',
                action: () => this.controller.setStockToGroup(stock),
            },
            {
                caption: '删除自选',
                action: () => this.controller.removeMyAll(stock),
            },
            undefined,
            {
                caption: '取消操作',
                action: () => {},
            }
        ]} icon="cog" content="分组"
        className="cursor-pointer btn btn-sm btn-outline-info align-self-start" />;
        */
        return <button className="btn btn-sm btn-outline-info align-self-start"
            onClick={() => storeApp.setStockToGroup(stock, closeLevelWhenRemoved)}>
            <FA name="cog" className="small me-1" fixWidth={true} />分组
        </button>;
    }
    else {
        return <button className="btn btn-sm btn-outline-primary align-self-start"
            onClick={() => storeApp.toggleMyAll(stock)}>
            <FA name="plus" className="small me-1" fixWidth={true} />自选
        </button>;
    }
}
