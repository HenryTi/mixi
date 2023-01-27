import { Error } from "./Error";
import { PageFooterProps, PageProps, PageTemplateProps } from "./PageProps";
import { usePageTemplate } from "./PageTemplate";
//import "../css/tonwa-page.css";
import { Back } from "./BackTemplate";

const defaultContentClassName = ' bg-white ';

function Header(props: PageProps) {
    let { back, header, right, template: templateName } = props;
    let template = usePageTemplate(templateName);
    let { Back } = template;
    return <div>
        <div className="tonwa-band-container d-flex h-min-3c border-bottom align-items-center tonwa-page-header-content">
            <Back back={back} />
            <div className="flex-grow-1">{header}</div>
            <div className="mx-2">{right}</div>
        </div>
    </div>
}

function Footer(props: PageFooterProps) {
    return <div className="tonwa-band-container d-flex flex-column tonwa-page-footer-content">
        {props.footer}
    </div>;
}

function Content(props: PageProps) {
    let { contentClassName, template: templateName } = props;
    let template = usePageTemplate(templateName);
    if (!contentClassName) {
        let { contentClassName: templateContentClassName } = template;
        contentClassName = templateContentClassName;
        if (!contentClassName) contentClassName = defaultContentClassName;
    }
    return <div className={'tonwa-band-container ' + contentClassName} style={{ display: 'flow-root' }}>
        {props.children}
    </div>;
}

export const appPageStackTemplate: PageTemplateProps = {
    Back: Back,
    Header,
    Footer,
    Content,
    contentClassName: defaultContentClassName,
    Error,
    errorPosition: 'under-header',
}
