import { UPage, useNav } from 'tonwa-com';
import { Band } from 'tonwa-com';
import { BandPassword } from 'tonwa-com';
import { Form, Submit } from 'tonwa-com';
import { useUqAppBase } from '../../UqApp';
import { Pass } from './Pass';
import { ForgetSuccess, RegisterSuccess } from './Success';

interface Props {
    header: string;
    submitCaption: string;
    account: string;
    onPasswordSubmit: (pwd: string) => Promise<string>;
}

function Password({ header, submitCaption, account, onPasswordSubmit }: Props) {
    let nav = useNav();
    let onButtonSubmit = async (values: any): Promise<any> => {
        let { pwd, rePwd } = values;
        let error: string;
        if (!pwd || pwd !== rePwd) {
            error = '密码错误，请重新输入密码！';
            return [['pwd', undefined], ['rePwd', undefined], ['pwd', error]];
        }
        else {
            error = await onPasswordSubmit(pwd);
            if (error !== undefined) {
                nav.open(<UPage header="注册不成功"><div className="p-5 text-danger">{error}</div></UPage>);
            }
        }
        return error;
    }
    /*
    let onEnter = async (name: string, context: Context): Promise<string> => {
        if (name === 'rePwd') {
            return await onButtonSubmit('submit', context);
        }
    }
    */
    return <UPage header={header}>
        <div className="w-max-20c my-5 py-5"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            注册账号<br />
            <div className="py-2 px-3 my-2 text-primary bg-light"><b>{account}</b></div>
            <div className="h-1c" />
            <Form>
                <BandPassword name="pwd" label="密码" placeholder="密码" maxLength={100} />
                <BandPassword name="rePwd" label="重复密码" placeholder="重复密码" maxLength={100} />
                <Band contentContainerClassName="mt-3">
                    <Submit onSubmit={onButtonSubmit}>{submitCaption}</Submit>
                </Band>
            </Form>
        </div>
    </UPage>;
}

interface RegisterParameter {
    nick: string,
    user: string,
    pwd: string,
    country: number,
    mobile: number,
    mobileCountry: number,
    email: string,
    verify: string,
};

export function RegisterPassword({ pass }: { pass: Pass; }) {
    let nav = useNav();
    let { userApi } = useUqAppBase();
    let { type, account, verify } = pass;
    let onPasswordSubmit = async (pwd: string): Promise<string> => {
        pass.password = pwd;
        let params: RegisterParameter = {
            nick: undefined,
            user: account,
            pwd,
            country: undefined,
            mobile: undefined,
            mobileCountry: undefined,
            email: undefined,
            verify: verify
        }
        switch (type) {
            case 'mobile':
                params.mobile = Number(account);
                params.mobileCountry = 86;
                break;
            case 'email':
                params.email = account;
                break;
        }
        let ret = await userApi.register(params);
        if (ret === 0) {
            nav.clear();
            nav.open(<RegisterSuccess pass={pass} />);
            return;
        }
        let error = regReturn(ret)
        return error;
    }

    function regReturn(registerReturn: number): string {
        let msg: any;
        switch (registerReturn) {
            default: return '服务器发生错误';
            case 4: return '验证码错误';
            case 0: return;
            case 1: msg = '用户名 ' + account; break;
            case 2: msg = '手机号 +' + account; break;
            case 3: msg = '邮箱 ' + account; break;
        }
        return msg + ' 已经被注册过了';
    }

    return <Password header="注册账号" submitCaption="注册新账号" account={account} onPasswordSubmit={onPasswordSubmit} />;
}

export function ForgetPassword({ pass }: { pass: Pass; }) {
    let nav = useNav();
    let { userApi } = useUqAppBase();
    let { account, password, verify, type } = pass;
    let onPasswordSubmit = async (pwd: string): Promise<string> => {
        pass.password = pwd;
        let ret = await userApi.resetPassword(account, password, verify, type);
        if (ret.length === 0) {
            let err = 'something wrong in reseting password';
            console.log(err);
            throw err;
        }
        nav.clear();
        nav.open(<ForgetSuccess pass={pass} />);
        return;
    }

    return <Password header="账号密码" submitCaption="改密码" account={account} onPasswordSubmit={onPasswordSubmit} />;
}
