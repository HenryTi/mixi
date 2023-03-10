import { Route } from "react-router-dom";
import { PageEdit } from "./PageEdit";
import { pathStoreIn } from "./SheetParts";

export const routeStoreIn = <>
    <Route path={pathStoreIn} element={<PageEdit />} />
    <Route path={`${pathStoreIn}/:id`} element={<PageEdit />} />
</>;
