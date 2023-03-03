import { Route } from "react-router-dom";
import { routeContact } from "./Contact";
import { routeProduct, } from "./Product";
import { routeSheet } from "./Sheet";

export const pathTrial = 'trial';
export const routeTrial = <Route path={pathTrial + '/*'}>
    {routeProduct}
    {routeContact}
    {routeSheet}
</Route>;
