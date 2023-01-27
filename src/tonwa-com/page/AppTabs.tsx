import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FA } from '../coms';
import { useSnapshot } from 'valtio';
import { TabItem, /*TabNavContext, useAppNav, */useTabNav } from './nav';
import { StackContainer } from './StackContainer';
import { ScrollContext } from './useScroll';

interface AppTabsProps {
    pages?: TabItem[];
    active?: TabItem;

    Tab?: (props: { title: string; }) => JSX.Element;
    TabKept?: (props: { title: string; }) => JSX.Element;
    TabClose?: () => JSX.Element;
}
export function AppTabs(props: AppTabsProps) {
    const { active_page } = useParams();
    let tabNav = useTabNav();

    let { Tab, TabKept, TabClose } = props;
    if (!Tab) Tab = ({ title }) => {
        return <div className="ps-3 pe-2 py-2">
            {title}
        </div>;
    }
    if (!TabKept) TabKept = ({ title }) => {
        return <>
            <FA name="home" className="me-2" size='lg' />{title}
        </>;
    }
    if (!TabClose) TabClose = () => {
        let cn = 'btn btn-sm btn-outline-primary px-1 me-1 border-0 py-0 align-self-center';
        return <div className={cn}>
            <FA name="times" />
        </div>;
    }

    useEffect(() => {
        let { pages, active } = props;
        let { defaultActive, data, appNav } = tabNav;
        let { stack } = data;
        let activePage = active_page ? active_page : defaultActive?.key;
        tabNav.setInitTabs(pages, active);
        if (!activePage) return;
        let ap = activePage;
        let p = stack.findIndex(v => v.key === activePage);
        if (p < 0) ap = defaultActive?.key;
        if (ap) {
            appNav.navigate(`${ap}`);
        }
    }, [props, tabNav]); // eslint-disable-line react-hooks/exhaustive-deps
    // 注意：上面这里的相关数组，不能包含active_page。否则，每次更新url，都会重载AppTabs

    let { defaultActive, data, response } = tabNav;
    let { stack } = data;
    let tabs = useSnapshot(stack);
    let { active } = useSnapshot(response);
    let activePage = active?.key ?? active_page ?? defaultActive?.key;
    function TabContainer(tab: TabItem) {
        let { key: name, keep, title } = tab;
        let cnTab = 'nav-item nav-link d-flex align-items-center p-0 '
            + (activePage === name ? 'active' : 'cursor-pointer');
        let vTab: any;
        if (keep === true) {
            cnTab += ' px-3 py-2 ';
            vTab = <TabKept title={title} />;
        }
        else {
            cnTab += ' d-flex align-items-center ';
            vTab = <>
                <Tab title={title} />
                <div onClick={evt => { tabNav.closeTab(tab); evt.stopPropagation(); }}>
                    <TabClose />
                </div>
            </>;
        }
        return <li key={name} className={cnTab} role="button" onClick={() => tabNav.activate(tab)}>
            {vTab}
        </li>
    }

    return <div className="d-flex flex-column flex-fill overflow-hidden">
        <ul className="nav nav-tabs">{tabs.map(tab => TabContainer(tab))}</ul>
        <ScrollContext.Provider value='app-tabs'>
            <StackContainer active={activePage} stackItems={tabs} />
        </ScrollContext.Provider>
    </div>;
}
/*
export function AppTabsContainer({ children }: { children: React.ReactNode; }) {
    let appNav = useAppNav();
    return <TabNavContext.Provider value={appNav.tabNav}>
        {children}
    </TabNavContext.Provider>;
}
*/
