import { Error } from "./Error";
import { PageFooterProps, PageHeaderProps, PageProps, PageTemplateProps } from "./PageProps";
import { usePageTemplate } from "./PageTemplate";
import { Back } from "./BackTemplate";

const defaultContentClassName = ' bg-white ';

function Header(props: PageHeaderProps) {
    let { back, header, right } = props;
    let { Back } = appTabsTemplate;
    return <div>
        <div className="d-flex py-2 border-bottom align-items-center tonwa-page-header-content">
            <Back back={back} />
            <div className="">{header}</div>
            <div className="ms-3">{right}</div>
        </div>
    </div>
}

function Footer(props: PageFooterProps) {
    return <div className="d-flex flex-column tonwa-page-header-content">
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
    return <div className={' ' + contentClassName} style={{ display: 'flow-root' }}>
        {props.children}
    </div>;
}

export const appTabsTemplate: PageTemplateProps = {
    Back: Back,
    Header,
    Footer,
    Content,
    contentClassName: defaultContentClassName,
    Error,
    errorPosition: 'above-header',
}
