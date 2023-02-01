import { Route } from "react-router-dom";
import { PageGroupStock } from "./PageGroupStocks";
import { PageMirateAvg } from "./PageMirateAvg";
import { PageSetTrackDay } from "./PageTrack";

export const pathGroupStocks = '/stocks';
export const pathMirateAvg = '/mirateAvg';
export const pathSetTrackDay = '/setTrackDay';
export const routeFind = <>
    <Route path={pathGroupStocks} element={<PageGroupStock />} />
    <Route path={pathMirateAvg} element={<PageMirateAvg />} />
    <Route path={pathSetTrackDay} element={<PageSetTrackDay />} />
</>;
