import { ButtonBlockStock } from "app/coms/ButtonBlockStock";
import { ButtonPinStock } from "app/coms/ButtonPinStock";
import { ViewStockRow } from "app/coms/ItemViewStock";
import { ViewStockLink } from "app/coms/ViewStockLink";
import { StoreStockInfo } from "app/stores";
import { useOutletContext } from "react-router-dom";

export function ViewBaseInfo() {
    const storeStockInfo = useOutletContext<StoreStockInfo>();
    const { stock, isBlock } = storeStockInfo;
    let closeLevelWhenRemoved = 1;
    let pinStock = <div className="d-flex align-self-stretch align-items-center">
        <ViewStockLink stock={stock} />
        &nbsp;
        <ButtonPinStock stock={stock} closeLevelWhenRemoved={closeLevelWhenRemoved} />
        &nbsp;
        <ButtonBlockStock stock={stock} isBlock={isBlock} />
    </div>;
    return <div className="bg-white">
        <ViewStockRow order={undefined} stock={stock} onClickName={undefined} right={pinStock} />
    </div>;
}
