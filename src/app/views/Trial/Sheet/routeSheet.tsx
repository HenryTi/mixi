import { Route } from "react-router-dom";
import { PageSheetEdit } from "./PageSheetEdit";
import { PageSheetNew } from "./PageSheetNew";
import { PageSheetList } from "./PageSheetList";

export const pathSheet = 'sheet';
export const pathSheetNew = 'sheet-new';
export const pathSheetEdit = 'sheet-edit';
export const routeSheet = <>
    <Route path={pathSheet} element={<PageSheetList />} />
    <Route path={pathSheetNew} element={<PageSheetNew />} />
    <Route path={`${pathSheetEdit}/:id`} element={<PageSheetEdit />} />
    <Route path={pathSheetEdit} element={<PageSheetEdit />} />
</>;
