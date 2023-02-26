import { Page, useScrollRestoration } from "tonwa-app";
import { LinkMiRateAvg, LinkTrack } from "./Links";
import { ViewFindStock } from "./ViewFindStock";

export function TabFind() {
    useScrollRestoration();
    return <Page header="发现" back="none">
        <ViewFindStock />
        <div className="d-flex flex-wrap bg-white p-2 my-2">
            <LinkMiRateAvg />
            <LinkTrack />
        </div>
    </Page>;
}
