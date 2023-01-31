import { proxy, useSnapshot } from "valtio";
import { AppTabs, useNav, useAppNav, UPage, TabNav, useTabNav/*, AppTabsContainer*/ } from 'tonwa-com';
import { TrialPage1 } from './TrialPage1';
import { AppLogin } from "./AppImage";
import { useEffect } from "react";

const tabDraft = {
    key: 'draft',
    title: "Draft",
    keep: true,
    page: <UPage contentClassName="bg-success">
        <div className="p-2">
            <h4 className="text-info">Draft Tasks</h4>
            <div style={{ height: '10em' }} />
            <div>draft bottom</div>
        </div>
    </UPage>
};
const tabInProgress = {
    key: "in_progress",
    title: "In Progress",
    keep: true,
    page: <div className="container-fluid">
        <div className="row p-2">
            <div className="col sm-12 p-2">
                <h4 className="text-primary">In Progress Tasks</h4>
            </div>
        </div>
    </div>
};

function TestNav() {
    let nav = useNav();
    function onClick() {
        let id = ++tabNo;
        let key = 't' + id;
        let tabItem = {
            key,
            title: 'title ' + id,
            page: <div>content {id}</div>,
        }
        nav.openTab(tabItem);
    }
    return <div className="container-fluid">
        <div className="row p-2">
            <div className="col sm-12 p-2">
                <h4 className="text-success">Test Nav Completed Tasks</h4>
                <button onClick={onClick}>test</button>
            </div>
        </div>
    </div>;
}

const tabCompleted = {
    key: "completed",
    title: "Completed",
    page: <TestNav />,
};

const tabsArr = [tabDraft, tabInProgress, tabCompleted];
let tabNo = 0;
/*
export function AppWithTabs() {
    let appNav = useAppNav();
    let { isLogined } = useSnapshot(appNav.response);
    if (isLogined !== true) {
        return <AppLogin />;
    }
    return <AppTabsContainer>
        <TopBar />
        <div className="d-flex flex-grow-1 overflow-hidden">
            <SideBar />
            <AppTabs pages={tabsArr} active={tabDraft} />
        </div>
        <BottomBar />
    </AppTabsContainer>;
}
*/

function onAddTab(tabNav: TabNav) {
    let id = ++tabNo;
    let key = 't' + id;
    let tabItem = {
        key,
        title: 'title ' + id,
        page: <TrialPage1 id={id} />,
        onClose: undefined as any,
    }
    tabNav.openTab(tabItem);
}

interface Item {
    id: number;
    name: string;
}

export interface Tick {
    count: number;
    text: string;
    list: Item[];
}

const tick = proxy<Tick>({
    count: 0,
    text: 'ok',
    list: [],
});


function TopBar() {
    let nav = useTabNav();
    useEffect(() => {
        let timer = setInterval(() => {
            ++tick.count;
            let item = tick.list[3];
            if (item) {
                if (item.name.length > 100) item.name = '';
                item.name += ' - ' + Date.now();
            }
        }, 2000);
        return () => {
            clearInterval(timer);
        }
    }, []);
    let snap = useSnapshot(tick);
    return <div className="py-3">
        <h4 className="px-3">Tabs <button onClick={() => onAddTab(nav)}>+</button></h4>
        <div>vtest tick: {snap.count}</div>
    </div>;
}

function SideBar() {
    let nav = useTabNav();
    return <div className="border px-3 w-min-20c">
        <div className="my-2">left side bar</div>
        <button className="my-2" onClick={() => onAddTab(nav)}>新开页面</button>
    </div>;
}

function BottomBar() {
    return <div className="py-2 px-3 border text-center">
        <h5>bottom</h5>
    </div>;
}
