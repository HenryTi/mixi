import { Outlet, Route, useNavigate } from "react-router-dom";
import { PagePublic } from "tonwa-com";
import { Band } from "tonwa-com";
import { BandPassword } from "tonwa-com";
import { Form, Submit, FormErrors } from "tonwa-com";
import { useUqAppBase } from "../UqAppBase";
import { AuthFormBandTemplate } from "./AuthFormBandTemplate";

const pathChangeSucceed = '/changeSucceed';

export function PageChangePassword() {
    return <>
        <Outlet />
        <Route element={<PageChangePassword />}>
            <Route index element={<PageChangePasswordIndex />} />
            <Route path={pathChangeSucceed} element={<PageChangeSucceed />} />
        </Route>
    </>;
}

function PageChangePasswordIndex() {
    const navigate = useNavigate();
    let uqApp = useUqAppBase()
    let onSubmit = async (data: any): Promise<any> => {
        let { orgPassword, newPassword, newPassword1 } = data;
        if (newPassword !== newPassword1) {
            return ['newPassword1', '新密码错误，请重新输入'];
        }
        //let centerAppApi = new CenterAppApi('tv/', undefined);
        //let ret = await centerAppApi.changePassword({orgPassword, newPassword});
        let ret = await uqApp.userApi.changePassword({ orgPassword, newPassword })
        if (ret === false) {
            return ['orgPassword', '原密码错误'];
        }
        navigate(pathChangeSucceed, { replace: true });
    }

    return <PagePublic header="修改密码">
        <Form className="m-3 w-30c mx-auto" BandTemplate={AuthFormBandTemplate}>
            <BandPassword name="orgPassword" label="原密码" placeholder="输入原来的密码" maxLength={60} />
            <BandPassword name="newPassword" label="新密码" placeholder="输入新设的密码" maxLength={60} />
            <BandPassword name="newPassword1" label="确认密码" placeholder="再次输入新设密码" maxLength={60} />
            <Band>
                <FormErrors />
            </Band>
            <Band>
                <Submit onSubmit={onSubmit}>提交</Submit>
            </Band>
        </Form>
    </PagePublic>;
}

function PageChangeSucceed() {
    return <PagePublic header="修改密码" back="close">
        <div className="m-3  text-success">
            密码修改成功！
        </div>
    </PagePublic>;
}
