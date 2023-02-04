import { Link, Outlet, Route, useNavigate } from "react-router-dom";
import { Page } from "tonwa-com";
import { useUqAppBase } from "../UqAppBase";

const waitingTime = '一小时';
const pathQuitDone = 'done';

interface QuitPageProps {
    header?: string;
    back?: 'close' | 'back' | 'none';
    note: JSX.Element;
    children: React.ReactNode;
}
function Quit({ header, back, note, children }: QuitPageProps) {
    return <Page header={header ?? '注销账号'} back={back}>
        <div className="border border-danger rounded mx-auto m-3 w-max-30c bg-white ">
            <div className="p-4 border-bottom">{note}</div>
            <div className="p-3 text-center">
                {children}
            </div>
        </div>
    </Page>
}

/*
abstract class VUserQuitBase extends VPage<CLogin> {
    protected abstract get note(): any;
    protected get button1Caption(): string { return undefined; }
    protected get button2Caption(): string { return undefined; }
    protected renderButton1(): JSX.Element {
        let caption = this.button1Caption;
        if (caption === null) return null;
        return <button className="btn btn-primary" onClick={() => this.onClickButton1()}>
            {caption ?? '不注销'}
        </button>;
    }
    protected renderButton2(): JSX.Element {
        let caption = this.button2Caption;
        if (caption === null) return null;
        return <button className="btn btn-outline-info ms-3" onClick={() => this.onClickButton2()}>
            {caption ?? '确认注销'}
        </button>;
    }
    header() { return '注销账号' }
    content() {
        return <div className="border border-danger rounded mx-auto m-3 w-max-30c bg-white ">
            <div className="p-4 border-bottom">{this.note}</div>
            <div className="p-3 text-center">
                {this.renderButton1()}
                {this.renderButton2()}
            </div>
        </div>
    }

    protected onClickButton1() {
        this.closePage();
    }

    protected onClickButton2() {
    }
}
*/

export function UserQuit() {
    const pathConfirm = 'confirm';
    let note = <>
        注意：账号注销后，账号绑定手机、邮件等相关信息将被释放。账号无法将登录。<br />
        请确认！
    </>;
    const pageIndex = <Quit note={note}>
        <Link className="btn btn-primary" to={-1 as any}>
            不注销
        </Link>
        <Link className="btn btn-outline-info ms-3" to={pathConfirm}>
            我已了解，仍然注销
        </Link>
    </Quit>;
    return <Route element={<Outlet />}>
        <Route index element={pageIndex} />
        <Route path={pathConfirm} element={<QuitConfirm />} />
        <Route path={pathQuitDone} element={<QuitDone />} />
    </Route>;
}

function QuitConfirm() {
    const navigate = useNavigate();
    let uqApp = useUqAppBase();
    let note = <>
        账号注销后，如果在{waitingTime}内容重新登录账号，账号自动恢复。
        {waitingTime}之后，账号绑定手机、邮件等相关信息将被释放。账号无法将登录。<br />
        请再次确认！
    </>;
    let onClickButton2 = async () => {
        await uqApp.userApi.userQuit();
        //let centerAppApi = new CenterAppApi(this.controller.net, 'tv/');
        //await centerAppApi.userQuit();
        navigate(pathQuitDone);
    }
    return <Quit note={note}>
        <Link className="btn btn-primary" to={-2 as any}>
            不注销
        </Link>
        <button className="btn btn-outline-info ms-3" onClick={onClickButton2}>
            确认注销
        </button>
    </Quit>
}

function QuitDone() {
    let uqApp = useUqAppBase();
    let note = <>
        账号将在{waitingTime}后彻底注销。<br />
        如果在{waitingTime}内容重新登录账号，注销操作自动取消。
        {waitingTime}之后，账号绑定手机、邮件等相关信息将被释放。账号无法将登录。
    </>;
    let onClickButton1 = async () => {
        await uqApp.logined(undefined);
    }
    return <Quit header="注销已账号" note={note} back="none">
        <button className="btn btn-primary" onClick={onClickButton1}>
            不注销
        </button>
    </Quit>
}
