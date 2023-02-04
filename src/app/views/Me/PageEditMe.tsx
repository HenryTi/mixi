import { useSnapshot } from "valtio";
import { Page, useT, FA, PropEdit, BandString, Sep, BandCom, LabelRow, ContainerProps, LabelRowProps, LabelRowEdit } from "tonwa-com";
import { appT } from '../../res';
import { useUqApp } from "app/MyUqApp";
import { meT } from "./meRes";
import { Link, useNavigate } from "react-router-dom";
import { pathChangePassword, pathEditMe, pathLogout, pathUserQuit } from "./routeMe";

export function PageEditMe() {
    let uqApp = useUqApp();
    let { user } = useSnapshot(uqApp.state);
    let t = useT(meT, appT);

    let onValuesChanged = async (values: { name: string; value: any; preValue: any; }) => {
        let { name, value } = values;
        uqApp.setUserProp(name, value);
    }

    function LabelContainer({ children }: ContainerProps) {
        return <div className="d-flex flex-fill">a <div className="flex-fill" /> {children}</div>;
    }
    let temp: Partial<LabelRowProps> = {
        // LabelContainer,
        labelAlign: 'end',
    }
    //<BandImage label="头像" name="icon" />
    return <Page header="个人信息">
        <div>
            <LabelRow {...temp}>
                ok
                <div>content</div>
                <div>right</div>
            </LabelRow>
            <Sep />
            <LabelRow {...temp}>
                ok1
                <div>content</div>
                <div>right</div>
            </LabelRow>
            <Sep />
            <LabelRowEdit {...temp} label={"a"} value={1} />

            <PropEdit values={user} onValuesChanged={onValuesChanged}>
                <BandString label="别名" name="nick" placeholder="好的别名更方便记忆" />
                <BandCom label={t('changePassword')} toEdit={pathEditMe + pathChangePassword}>
                    <FA className="text-info m-2 align-self-center" name="key" />
                </BandCom>
                <BandCom label={t('userQuit')} toEdit={pathUserQuit}>
                    <FA className="text-info m-2 align-self-center" name="key" />
                </BandCom>
            </PropEdit>
            <Sep />
            <div className="mt-5 w-100 text-center">
                <Link className="btn btn-danger w-100 w-max-20c" to={pathLogout}>
                    <FA name="sign-out" size="lg" /> {t('logout')}
                </Link>
            </div>
        </div>
    </Page>;
}
