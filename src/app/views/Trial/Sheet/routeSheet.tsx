import { Route } from "react-router-dom";
import { PageSheetMain } from "./PageSheetMain";
import { PageSheetStart } from "./PageSheetStart";

export const pathSheet = 'sheet';
export const pathSheetMain = 'sheet-main';
export const routeSheet = <>
    <Route path={pathSheet} element={<PageSheetStart />} />
    <Route path={pathSheetMain} element={<PageSheetMain />} />
</>;
