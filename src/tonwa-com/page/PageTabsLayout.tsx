import { NavLink, Outlet } from "react-router-dom";

interface PageTabsLayoutProps {
    tabs: { to: string; caption: string; }[];
}

export function PageTabsLayout({ tabs }: PageTabsLayoutProps) {
    function tabClassName({ isActive }: {
        isActive: boolean;
        isPending: boolean;
    }) {
        return 'btn flex-fill mx-1 ' +
            (isActive === true ? 'btn-primary' : 'btn-info');
    }
    let vTabs = <div className="d-flex container">
        {tabs.map(v => {
            const { to, caption } = v;
            return <NavLink key={caption} to={to} className={tabClassName} replace={true}>{caption}</NavLink>;
        })}
    </div>;

    return <div className='d-flex flex-column flex-fill'>
        <div className='flex-fill d-flex'>
            <Outlet />
        </div>
        <div className='invisible'>
            {vTabs}
        </div>
        <div className='bg-warning position-fixed bottom-0 w-100'>
            {vTabs}
        </div>
    </div>;
}
