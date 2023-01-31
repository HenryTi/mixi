import { Route } from "react-router-dom";
import { PageSearch } from "./PageSearch";

export function pathSearch() { return '/search'; }
export const routeSearch = <>
    <Route path={pathSearch()} element={<PageSearch />} />
</>;
