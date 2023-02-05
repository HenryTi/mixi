import { Route } from "react-router-dom";
import { PageGroupStock } from "./PageGroupStocks";
import { PageMirateAvg } from "./PageMirateAvg";
import { PageSetTrackDay } from "./PageTrack";
import { PageStocksMyAll, PageStocksMyBlock } from "./ViewFindStock";

export function pathGroupStocks(id: string | number) {
    return `/group/${id}`;
}
export const pathMirateAvg = '/mirateAvg';
export const pathSetTrackDay = '/setTrackDay';
export const pathMyAll = '/myAll';
export const pathMyBlocks = '/myBlocks';
export const routeFind = <>
    <Route path={pathGroupStocks(':id')} element={<PageGroupStock />} />
    <Route path={pathMirateAvg} element={<PageMirateAvg />} />
    <Route path={pathSetTrackDay} element={<PageSetTrackDay />} />
    <Route path={pathMyAll} element={<PageStocksMyAll />} />
    <Route path={pathMyBlocks} element={<PageStocksMyBlock />} />
</>;
