import { Page, useNav } from "tonwa-com";
import { LinkMiRateAvg, LinkTrack } from "./Links";
import { ViewFindStock } from "./ViewFindStock";

export function TabFind() {
    return <Page header="发现" back="none">
        <ViewFindStock />
        <div className="d-flex flex-wrap bg-white p-2 my-2">
            <LinkMiRateAvg />
            <LinkTrack />
        </div>
    </Page>;
}
