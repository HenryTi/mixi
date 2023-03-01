import { Route } from "react-router-dom";
import { PageProductNew } from "./PageProductNew";
import { PageProductList } from "./PageProductList";
import { PageProductView } from "./PageProductView";
import { PageProductEdit } from "./PageProductEdit";

export const pathTrial = 'trial';
export const pathProductNew = 'product-new';
export const pathProductList = 'product-list';
export const pathProductView = 'product-view';
export const pathProductEdit = 'product-edit';
export const routeTrial = <Route path={pathTrial + '/*'}>
    <Route path={pathProductNew} element={<PageProductNew />} />
    <Route path={pathProductList} element={<PageProductList />} />
    <Route path={`${pathProductView}/:id`} element={<PageProductView />} />
    <Route path={`${pathProductEdit}/:id`} element={<PageProductEdit />} />
</Route>;
