import { Page } from "tonwa-com";
import { useUqAppBase } from "../UqAppBase";

export function Logout({ onLogout, resetAll }: { onLogout: () => Promise<void>; resetAll: () => void; }) {
    let uqApp = useUqAppBase();
    async function onClickLogout() {
        await uqApp.logined(undefined);
        await onLogout?.();
        document.location.reload();
    }
    let header = '安全退出';
    let footer = <div className="mt-5 text-center justify-content-center">
        <button className="btn btn-outline-warning" onClick={resetAll}>升级软件</button>
    </div>;
    return <Page back="back" header={header} footer={footer}>
        <div className="my-5 border border-info bg-white rounded-3 p-5 text-center mx-auto w-max-40c ">
            <div>退出当前账号不会删除任何历史数据，下次登录依然可以使用本账号</div>
            <div className="mt-5 text-center">
                <button className="btn btn-danger" onClick={onClickLogout}>安全退出</button>
            </div>
        </div>
    </Page>;
}
