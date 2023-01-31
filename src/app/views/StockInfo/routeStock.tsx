import { Route } from "react-router-dom";
import { PageStockInfo } from "./PageStockInfo";

export function toStock(id: string | number): string {
    return `/stock/${id}`;
}

export const routeStock = <>
    <Route path={toStock(':id')} element={<PageStockInfo />} />
</>;
