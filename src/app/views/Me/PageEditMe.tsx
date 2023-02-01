import { useSnapshot } from "valtio";
import { Page, useT, FA, Detail, BandString, Sep, BandCom, useNav } from "tonwa-com";
import { appT } from '../../res';
import { useUqApp } from "app/MyUqApp";
import { meT } from "./meRes";
import { useNavigate } from "react-router-dom";
import { pathChangePassword, pathEditMe, pathLogout, pathUserQuit } from "./routeMe";

export function PageEditMeIndex() {
    const navigate = useNavigate();
    let uqApp = useUqApp();
    let { user } = useSnapshot(uqApp.uqAppState);
    let t = useT(meT, appT);

    let onValuesChanged = async (values: { name: string; value: any; preValue: any; }) => {
        let { name, value } = values;
        uqApp.setUserProp(name, value);
    }

    let onExit = () => {
        navigate(pathLogout);
    }

    let changePassword = async () => {
        navigate(pathEditMe() + pathChangePassword);
    }

    let userQuit = async () => {
        navigate(pathUserQuit);
    }

    //<BandImage label="头像" name="icon" />
    return <Page header="个人信息">
        <div>
            <Detail values={user} onValuesChanged={onValuesChanged}>
                <BandString label="别名" name="nick" placeholder="好的别名更方便记忆" />
                <BandCom label={t('changePassword')} onEdit={changePassword}>
                    <FA className="text-info m-2 align-self-center" name="key" />
                </BandCom>
                <BandCom label={t('userQuit')} onEdit={userQuit}>
                    <FA className="text-info m-2 align-self-center" name="key" />
                </BandCom>
            </Detail>
            <Sep />
            <div className="mt-5 w-100 text-center">
                <button className="btn btn-danger w-100 w-max-20c" onClick={onExit}>
                    <FA name="sign-out" size="lg" /> {t('logout')}
                </button>
            </div>
        </div>
    </Page>;
}
