import { Route } from "react-router-dom";
import { routeContact } from "./IDContact";
import { routeProduct, } from "./IDProduct";
import { routeSheetPurchase } from "./SheetPurchase";
import { routeSheetCenter } from "./SheetCenter";
import { routeSheetStoreIn } from "./SheetStoreIn";
import { routeStoreIn } from "./StoreIn/routeStoreIn";

export const pathTrial = 'trial';
export const routeTrial = <Route path={pathTrial + '/*'}>
    {routeProduct}
    {routeContact}
    {routeSheetPurchase}
    {routeSheetCenter}
    {routeStoreIn}
</Route>;

// {routeSheetStoreIn}
