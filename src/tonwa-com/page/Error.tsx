import { useSnapshot } from "valtio";
import { FA, LMR } from "../coms";
import { useNav } from "./nav";
import { PageProps } from "./PageProps";
import { usePageTemplate } from "./PageTemplate";

export function Error(props: PageProps) {
    let nav = useNav();
    let { appNav } = nav;
    let { errorPosition } = usePageTemplate(props.template);
    let response = useSnapshot(appNav.response);
    let { error } = response;
    if (error === undefined) return null;
    function onShow() {
        alert(error.message);
    }
    return <div className={errorPosition === 'under-header' ? 'tonwa-band-container' : ''}>
        <LMR className="bg-light align-items-center border-bottom border-info">
            <div className="py-2 px-3 cursor-pointer" onClick={() => appNav.clearError()}>
                <FA name="times" size="lg" />
            </div>
            <FA className="text-danger me-2" name="exclamation-triangle" />
            <span className="text-info">{error.message}</span>
            <div className="py-2 px-3 cursor-pointer" onClick={onShow}>
                <FA name="angle-right" />
            </div>
        </LMR>
    </div>;
}
