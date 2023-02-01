import { Route } from "react-router-dom";
import { PageStockInfo } from "./PageStockInfo";

export function pathStockInfo(id: string | number): string {
    return `/stock/${id}`;
}

export const routeStock = <>
    <Route path={pathStockInfo(':id')} element={<PageStockInfo />} />
</>;
