import { Page, useNav } from "tonwa-com";
import { useUqAppBase } from "../UqApp";

const waitingTime = '一小时';

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

function Button1({ caption, onClick }: { caption?: string; onClick: () => void }) {
    return <button className="btn btn-primary" onClick={onClick}>
        {caption ?? '不注销'}
    </button>;
}

function Button2({ caption, onClick }: { caption: string; onClick: () => void }) {
    return <button className="btn btn-outline-info ms-3" onClick={onClick}>
        {caption ?? '确认注销'}
    </button>;
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
    let nav = useNav();
    let note = <>
        注意：账号注销后，账号绑定手机、邮件等相关信息将被释放。账号无法将登录。<br />
        请确认！
    </>;
    return <Quit note={note}>
        <Button1 onClick={() => nav.close()} />
        <Button2 onClick={() => nav.open(<QuitConfirm />)} caption="我已了解，仍然注销" />
    </Quit>
}

function QuitConfirm() {
    let nav = useNav();
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
        nav.open(<QuitDone />);
    }
    return <Quit note={note}>
        <Button1 onClick={() => nav.close(2)} />
        <Button2 onClick={onClickButton2} caption="确认注销" />
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
        <Button1 onClick={onClickButton1} caption="退出" />
    </Quit>
}
