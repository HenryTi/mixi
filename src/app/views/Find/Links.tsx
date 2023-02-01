import { Link } from "react-router-dom";
import { FA } from "tonwa-com";
import { pathMirateAvg, pathSetTrackDay } from "./routeFind";

const linkIcon = <FA name="chevron-circle-right" className="me-1 text-info" />;
export const trackCaption = "分析历史数据";

export function LinkMiRateAvg() {
    return <Link className="btn btn-link" to={pathMirateAvg}>
        {linkIcon}A股历史米息率
    </Link>
}

export function LinkTrack() {
    return <Link className="btn btn-link" to={pathSetTrackDay}>
        {linkIcon}{trackCaption}
    </Link>
}
