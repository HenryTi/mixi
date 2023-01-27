import { useSnapshot } from "valtio";
import { useNav, Page, UPage } from "tonwa-com"
import { useUqApp } from "App";
import { AppLogout } from "./AppImage";

export function TrialPage1({ id }: { id: number }) {
    let nav = useNav();
    let uqApp = useUqApp();
    let user = useSnapshot(uqApp.user);
    function onClick() {
        nav.open(<TrialPage2 />);
    }
    let { id: userId, name, nick, icon, token } = user;
    return <UPage header="aaa" footer={<div>footer</div>}>
        <div className="text-break">
            userId:{userId}, name:{name}, nick:{nick}, icon:{icon}, token:{token}
        </div>
        <div className="p-3">
            trial page id: {id}
            <div>
                <button onClick={onClick}>show page</button>
                <button onClick={() => nav.tabNav.closeTab()}>close me</button>
            </div>
            {Array(50).fill(0).map((v, index) => <p key={index}>{index}</p>)}
            <div>
                <button onClick={onClick}>show page</button>
                <button onClick={() => nav.tabNav.closeTab()}>close me</button>
            </div>
        </div>
    </UPage>
}

function TrialPage2() {
    let nav = useNav();
    return <Page header="trial page 2">
        <div className="p-3">
            trial page 2
            <button onClick={() => nav.close()}>back</button>
            <button onClick={() => nav.open(<TrialPage3 />)}>trial page 3</button>
        </div>
    </Page>;
}

function TrialPage3() {
    let nav = useNav();
    return <Page header="trial page 3">
        <div className="m-5">
            trial page 3
            <button onClick={() => nav.close()}>back</button>
        </div>
        <div>
            <button onClick={() => nav.appNav.open(<AppLogout />)}>logout</button>
        </div>
    </Page>;
}
