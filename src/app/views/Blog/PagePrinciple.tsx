import { SectionList } from "app/coms";
import { Page } from "tonwa-app";
import { blogsSections } from "./blogsSections";

export function PagePrinciple() {
    return <Page header="米投原则">
        <div className="p-3">
            <SectionList sections={blogsSections} />
        </div>
    </Page>
}
