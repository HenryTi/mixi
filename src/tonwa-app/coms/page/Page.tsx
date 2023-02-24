import { Suspense, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai/react";
import 'font-awesome/css/font-awesome.min.css';
import '../../css/tonwa-page.css';
import { useUqAppBase } from "../../UqAppBase";
import { PageProps, Scroller } from "./PageProps";
import { ButtonPageBack } from "./ButtonPageBack";
import { PageSpinner } from "./PageSpinner";

const scrollTimeGap = 100;
const scrollEdgeGap = 30;

// unanthorized page
export function PagePublic(props: PageProps) {
    let { children, header, back, right, footer, onClosed } = props;
    const div = useRef<HTMLDivElement>();
    useEffect(() => {
        function setScroll() {
            let { current: el } = div;
            if (!el) return;
            let elScroll = getScrollableParent(el);
            if (!elScroll) return;
            elScroll.onscroll = onScroll;
            window.onscroll = onScroll;

            let bottomTimeSave = 0;
            let topTimeSave = 0;
            let scrollTopSave = elScroll.scrollTop;
            function onScroll(e: any) {
                let { onScroll, onScrollTop, onScrollBottom } = props;
                if (onScroll) onScroll(e);
                let el = (e.target as Document).scrollingElement as HTMLBaseElement;
                if (el.scrollTop > scrollTopSave) scrollTopSave = el.scrollTop;
                let scroller = new Scroller(el);
                if (el.scrollTop < scrollEdgeGap) {
                    if (onScrollTop !== undefined) {
                        let topTime = new Date().getTime();
                        if (topTime - topTimeSave > scrollTimeGap) {
                            topTimeSave = topTime;
                            onScrollTop(scroller).then(ret => {
                                // has more
                                if (ret === true) {
                                    let sh = el.scrollHeight;
                                    let top = 200;
                                    if (top > sh) top = sh;
                                    el.scrollTop = top;
                                }
                            });
                        }
                    }
                }
                if (el.scrollTop + el.offsetHeight > el.scrollHeight - scrollEdgeGap) {
                    if (onScrollBottom !== undefined && el.scrollTop >= scrollTopSave) {
                        ++scrollTopSave;
                        let bottomTime = new Date().getTime();
                        if (bottomTime - bottomTimeSave > scrollTimeGap) {
                            bottomTimeSave = bottomTime;
                            onScrollBottom(scroller);
                        }
                    }
                }
            }
        }
        setScroll();
        return () => {
            onClosed?.();
        }
    });
    if (header || back || right) {
        header = <div className="d-flex align-items-center">
            <ButtonPageBack {...props} />
            <div className="flex-fill">{header}</div>
            {right}
        </div>;
    }
    return <div ref={div} className="tonwa-page">
        <Suspense fallback={<PageSpinner />}>
            <div className='tonwa-page-header position-sticky top-0'>
                <div className='container px-0 d-flex'>
                    {header}
                </div>
            </div>
            <div className='tonwa-page-content flex-fill d-flex'>
                <div className='container px-0 d-flex flex-column'>
                    {children}
                </div>
            </div>
            <div className='tonwa-page-footer position-sticky bottom-0'>
                <div className='container px-0'>
                    {footer}
                </div>
            </div>
        </Suspense>
    </div>;
}

export function Page(props: PageProps) {
    const uqApp = useUqAppBase();
    const navigate = useNavigate();
    const { user: userAtom, mustLogin, pathLogin } = uqApp;
    const user = useAtomValue(userAtom);
    const { pathname } = useLocation();
    useEffect(() => {
        if (mustLogin && !user && pathLogin) {
            navigate(pathLogin, { state: pathname });
        }
    }, [user, mustLogin, pathLogin]);
    if (mustLogin && !user) return null;
    return <PagePublic {...props} />;
}

function isScrollable(ele: HTMLElement) {
    const hasScrollableContent = ele.scrollHeight > ele.clientHeight;

    const overflowYStyle = window.getComputedStyle(ele).overflowY;
    const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

    return hasScrollableContent && !isOverflowHidden;
}

function getScrollableParent(ele: HTMLElement): HTMLElement {
    return (!ele || ele === document.body) ?
        document.body
        :
        (
            isScrollable(ele) ?
                ele
                :
                getScrollableParent(ele.parentElement)
        );
}
