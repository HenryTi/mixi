import { FA } from "../coms";
import { useNav } from "./nav";
import { PageBackProps } from "./PageProps";

export function Back(props: PageBackProps) {
    let { back } = props;
    let nav = useNav();
    let { appNav } = nav;
    function onClickBack() {
        if (nav.data.stack.length === 1) {
            appNav.close(); //.navigate(-1 as any);
        }
        else {
            nav.close();
        }
    }
    function renderBack(iconName: string) {
        return <div className="px-3 cursor-pointer" onClick={onClickBack}>
            <FA name={iconName} />
        </div>;
    }
    function renderNone() {
        return <div className="pe-3" />;
    }
    switch (back) {
        default:
        case 'back': break;
        case 'none': return renderNone();
        case 'close': return renderBack('close');
    }
    if (nav.data.stack.length > 1
        || (!nav.tabNav && appNav.data.stack.length > 1)) {
        return renderBack('angle-left');
    }
    return renderNone();
}
