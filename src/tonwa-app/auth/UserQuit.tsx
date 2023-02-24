import { useNavigate } from "react-router-dom";
import { PagePublic } from "../coms";
import { useModal, useUqAppBase } from "../UqAppBase";

const waitingTime = '一小时';

interface MessageBoxProps {
    note: JSX.Element;
    children: React.ReactNode;
}
function MessageBox({ note, children }: MessageBoxProps) {
    return <div className="border border-danger rounded mx-auto m-3 w-max-30c bg-white ">
        <div className="p-4 border-bottom">{note}</div>
        <div className="p-3 text-center">
            {children}
        </div>
    </div>
}

export function UserQuit() {
    const navigate = useNavigate();
    const { openModal } = useModal();
    let note = <>
        注意：账号注销后，账号绑定手机、邮件等相关信息将被释放。账号无法将登录。<br />
        请确认！
    </>;
    const quitCaption = '注销账号';
    function closePage() {
        navigate(-1);
    }
    return <PagePublic header={quitCaption}>
        <MessageBox note={note}>
            <button className="btn btn-primary" onClick={() => navigate(-1)}>
                不注销
            </button>
            <button className="btn btn-outline-info ms-3" onClick={() => openModal(<QuitConfirm />, quitCaption, closePage)}>
                我已了解，仍然注销
            </button>
        </MessageBox>
    </PagePublic>;
}

function QuitConfirm() {
    let uqApp = useUqAppBase();
    const { openModal, closeModal } = useModal();
    let note = <>
        账号注销后，如果在{waitingTime}内容重新登录账号，账号自动恢复。
        {waitingTime}之后，账号绑定手机、邮件等相关信息将被释放。账号无法将登录。<br />
        请再次确认！
    </>;
    let onClickButton2 = async () => {
        await uqApp.userApi.userQuit();
        closeModal();
        await openModal(<QuitDone />, '注销已账号', () => uqApp.restart());
    }
    return <MessageBox note={note}>
        <button className="btn btn-primary" onClick={() => closeModal()}>
            不注销
        </button>
        <button className="btn btn-outline-info ms-3" onClick={onClickButton2}>
            确认注销
        </button>
    </MessageBox>
}

function QuitDone() {
    let uqApp = useUqAppBase();
    const { openModal, closeModal } = useModal();
    let note = <>
        账号将在{waitingTime}后彻底注销。<br />
        如果在{waitingTime}内容重新登录账号，注销操作自动取消。
        {waitingTime}之后，账号绑定手机、邮件等相关信息将被释放。账号无法将登录。
    </>;
    let onClickButton1 = () => {
        openModal(<QuitCancel />, '恢复账号', () => uqApp.restart());
    }
    return <MessageBox note={note}>
        <button className="btn btn-primary" onClick={onClickButton1}>
            反悔了，不要注销
        </button>
    </MessageBox>
}

function QuitCancel() {
    let uqApp = useUqAppBase();
    let note = <>
        重新登录之后，账号将恢复。<br />
    </>;
    async function restore() {
        await uqApp.logined(undefined);
        uqApp.restart();
    }
    return <MessageBox note={note}>
        <button className="btn btn-primary" onClick={restore}>
            重新登录
        </button>
    </MessageBox>;
}
