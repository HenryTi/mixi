import { FA, useNav } from "tonwa-com";
import { PageMirateAvg } from "./PageMirateAvg";
import { PageSetTrackDay } from "./PageTrack";

const linkIcon = <FA name="chevron-circle-right" className="me-1 text-info" />;
export const trackCaption = "分析历史数据";

export function LinkMiRateAvg() {
    const nav = useNav();
    function showMiRateAvg() {
        nav.open(<PageMirateAvg />);
    }
    return <div className="btn btn-link" onClick={showMiRateAvg}>
        {linkIcon}A股历史米息率
    </div>
}

export function LinkTrack() {
    const nav = useNav();
    function showTrack() {
        nav.open(<PageSetTrackDay />);
    }
    return <div className="btn btn-link" onClick={showTrack}>
        {linkIcon}{trackCaption}
    </div>
}
