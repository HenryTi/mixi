import { PageTemplateProps } from "./PageProps";

export function usePageTemplate(templateName?: string) {
    if (!templateName) {
        return defaultTemplate;
    }
    let template = templates[templateName];
    return template;
}

export function setPageTemplate(templateName: string, template: PageTemplateProps) {
    if (!templateName) {
        Object.assign(defaultTemplate, template);
    }
    else {
        templates[templateName] = template;
    }
}

const defaultTemplate: PageTemplateProps = {} as any;
const templates: { [name: string]: PageTemplateProps } = {};

