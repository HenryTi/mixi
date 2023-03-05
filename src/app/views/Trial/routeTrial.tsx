import { Route } from "react-router-dom";
import { routeContact } from "./IDContact";
import { routeProduct, } from "./IDProduct";
import { routeSheetPurchase } from "./SheetPurchase";

export const pathTrial = 'trial';
export const routeTrial = <Route path={pathTrial + '/*'}>
    {routeProduct}
    {routeContact}
    {routeSheetPurchase}
</Route>;
