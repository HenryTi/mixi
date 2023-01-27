import { useSnapshot } from "valtio";
import { FA } from "../coms";
import { useAppNav, useNav } from "./nav";
import { PageProps, Scroller } from "./PageProps";
import { usePageTemplate } from "./PageTemplate";
import 'font-awesome/css/font-awesome.min.css';
import '../css/tonwa.css';
import { useEffect, useRef } from "react";

const scrollTimeGap = 100;
const scrollEdgeGap = 30;

// unanthorized page
export function UPage(props: PageProps) {
    const div = useRef<HTMLDivElement>();
    useEffect(() => {
        let { current: el } = div;
        let elScroll: HTMLElement;
        if (el.parentElement.className.includes('tonwa-pane') === true) {
            elScroll = el.parentElement;
        }
        else {
            elScroll = el;
        }
        elScroll.onscroll = onScroll;
        let bottomTimeSave = 0;
        let topTimeSave = 0;
        let scrollTopSave = elScroll.scrollTop;
        function onScroll(e: any) {
            let { onScroll, onScrollTop, onScrollBottom } = props;
            if (onScroll) onScroll(e);
            let el = e.target as HTMLBaseElement;
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
    });
    let { children, header, back, right, footer, template: templateName, id } = props;
    let template = usePageTemplate(templateName);
    if (header || back || right) {
        let { Header } = props;
        if (!Header) {
            let { Header: TemplateHeader } = template;
            Header = TemplateHeader;
        }
        header = <Header header={header} back={back} right={right} />;
    }
    if (footer) {
        let { Footer } = props;
        if (!Footer) {
            let { Footer: TemplateFooter } = template;
            Footer = TemplateFooter;
        }
        footer = <Footer footer={footer} />;
    }
    let { Content } = props;
    if (!Content) {
        let { Content: TemplateContent } = template;
        Content = TemplateContent;
    }
    header = header && <div className="position-sticky tonwa-page-header" style={{ top: 0, zIndex: 9999 }}>{header}</div>;
    let { errorPosition, Error } = template;
    switch (errorPosition) {
        case 'above-header':
            header = <>{<Error template={templateName} />}{header}</>
            break;
        case 'under-header':
            header = <>{header}{<Error template={templateName} />}</>
            break;
    }
    //let cnPage = '-inner-page d-flex flex-grow-1 flex-column';
    // header and content in one div, flex-grow:1, can make sticking to bottom
    return <div ref={div} className="tonwa-page" id={id}>
        <div className="tonwa-page-full">
            {header}
            <Content {...props}>{children}</Content>
        </div>
        {footer && <div className="tonwa-page-footer" style={{ position: 'sticky', bottom: '0px' }}>{footer}</div>}
    </div>;
}

export function Page(props: PageProps) {
    let appNav = useAppNav();
    let { isLogined } = useSnapshot(appNav.response);
    if (isLogined !== true) {
        return <Unanthorized />;
    }
    return <UPage {...props} />;
}

function Unanthorized() {
    let nav = useNav();
    return <div className="p-3">
        <div className="mb-3">
            <FA name="ban" className="text-danger me-3" />
            not logined, can not show a {'<Page />'}, try {'<UPage />'}.
        </div>
        <div>
            <button className="btn btn-outline-primary" onClick={() => nav.close()}><FA name="angle-left" /></button>
        </div>
    </div>;
}
