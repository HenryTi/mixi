// import { TabHome } from "./Home";
// import { IDsPage } from "./IDs";
//import { ActsPage } from "./Acts";
import { PageTabs, Tab, FA, useT } from "tonwa-com";
import { appT } from "./res";
import { TabHome, TabMe, TabFind } from './views';
import { Chart, registerables } from 'chart.js';
/*
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
*/
Chart.register(...registerables);
/*
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
*/
export function MainPage() {
    let t = useT(appT);
    function TabTag({ caption, icon }: { caption?: string | JSX.Element; icon?: string; }) {
        return <div className="d-flex flex-column align-items-center px-2 py-1">
            <div className="align-self-center py-1"><FA name={icon} size="lg" /></div>
            <small>{caption}</small>
        </div>;
    }
    return <PageTabs>
        <Tab tag={<TabTag caption={t('home')} icon="wrench" />}>
            <TabHome />
        </Tab>
        <Tab tag={<TabTag caption={t('find')} icon="circle-o" />}>
            <TabFind />
        </Tab>
        <Tab tag={<TabTag caption={t('me')} icon="circle-o" />}>
            <TabMe />
        </Tab>
    </PageTabs>;
}
