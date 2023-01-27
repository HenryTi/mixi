import React, { Suspense, useContext, useMemo } from "react";
import { useSnapshot } from "valtio";
import { PageStackContext, StackItem, useAppNav } from "./nav";
import { PageSpinner } from "./PageSpinner";
import { ScrollContext } from "./useScroll";

export function StackContainer({ active, stackItems }: { active?: string; stackItems: readonly StackItem[] }) {
    let last = stackItems.length - 1;
    return <>
        {
            stackItems.map((item, index) => {
                let { key: name, page } = item;
                let display: boolean;
                if (active) {
                    display = active === name;
                }
                else {
                    display = index === last;
                }
                return <Stack key={name} display={display}>{page}</Stack>;
            })
        }
    </>;
}

function Stack({ display, children }: { display: boolean; children: React.ReactNode; }) {
    const appNav = useAppNav();
    // const { tabNav } = appNav;
    let scrollContext = useContext(ScrollContext);
    let nav = useMemo(() => appNav.createNav(), [appNav]);
    nav.setInitPage(children);
    let { stack } = useSnapshot(nav.data);
    //let snapshot = useSnapshot(data);
    //let { stack: snapshotStack } = snapshot;
    let len = stack.length;
    let last = len - 1;
    // const flexFill = 'flex-column flex-grow-1 '
    /*
    let overflowY: any;
    switch (scrollContext) {
        default: overflowY = 'auto'; break;
        case 'app-tabs': overflowY = 'auto'; break;
        case 'page-tabs': overflowY = 'scroll'; break;
    }
    */
    return <PageStackContext.Provider value={nav}>
        {stack.map((v, index) => {
            let { key: pageKey, page } = v;
            return <div key={pageKey}
                className={'tonwa-stack ' + (display === true && index === last ? 'd-flex' : 'd-none')}
            >
                <Suspense fallback={<PageSpinner />}>
                    {page}
                </Suspense>
            </div>
        })}
    </PageStackContext.Provider>;
}
