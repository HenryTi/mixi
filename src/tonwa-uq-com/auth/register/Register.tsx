import { FunctionComponent, useRef } from 'react';
import { UPage, useNav } from 'tonwa-com';
import { getSender } from '../tools';
import { Verify } from './Verify';
import { Pass } from './Pass';
import { ForgetPassword, RegisterPassword } from './Password';
import { Login } from '../Login';
import { useUqAppBase } from '../../UqApp';
import { BandString } from 'tonwa-com';
import { Band, BandContainerContext } from 'tonwa-com';
import { Form, FormBandTemplate1, Submit } from 'tonwa-com';

interface StartProps {
    privacy: JSX.Element;
    loginTop: JSX.Element;
}

interface Props extends StartProps {
    header: string;
    accountLable: string;
    Password: FunctionComponent<{ pass: Pass; }>;
    accountError: (isExists: number) => string;
    sendVerifyOem: string;          // 发送短信或者邮件的时候的厂家标志
}

function RegisterPageBase({ header, accountLable, privacy, loginTop, Password, accountError, sendVerifyOem }: Props) {
    let nav = useNav();
    let { userApi } = useUqAppBase();
    let { current: pass } = useRef({} as Pass);
    async function onValuesChanged({ name, value }: { name: string; value: any; }, context: BandContainerContext<any>) {
        let field = context.fields['submit'];
        if (field) {
            context.setDisabled('submit', (value as string).length < 6)
        }
    }
    let onSubmit = async (values: any): Promise<any> => {
        let user = 'user';
        let value = values[user];
        let sender = getSender(value);
        if (sender === undefined) {
            return [undefined, [user, '必须是手机号或邮箱']];
        }
        let type: 'mobile' | 'email' = sender.type as 'mobile' | 'email';
        if (type === 'mobile') {
            if (value.length !== 11 || value[0] !== '1') {
                return [undefined, [user, '请输入正确的手机号']];
            }
        }
        //this.controller.account = value;
        //this.controller.type = type;
        //await checkAccount(type, value);
        let account = value;
        let ret = await userApi.isExists(account);
        let error = accountError(ret);
        if (error !== undefined) return error;
        ret = await userApi.sendVerify(account, type, sendVerifyOem);
        if (ret !== undefined) {
            return [undefined, [user, ret]];
        }

        let onVerify = async (verify: string) => {
            pass.verify = verify;
            let ret = await userApi.checkVerify(account, verify);
            if (ret === 0) return ret;
            nav.open(<Password pass={pass} />);
        }
        nav.open(<Verify onVerify={onVerify} pass={pass} />);
    }
    /*
        let onEnter = async (name: string, context: Context): Promise<string> => {
            if (name === 'user') {
                return await onSubmit('verify', context);
            }
        }
    */
    function onToLogin(evt: React.MouseEvent<HTMLAnchorElement>) {
        evt.preventDefault();
        nav.open(<Login loginTop={loginTop} privacy={privacy} />);
    }

    return <UPage header={header} footer={privacy}>
        <div className="d-grid">
            <div className="d-grid w-20c my-5 py-5"
                style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                {loginTop ?? <div className="text-center p-3 fs-5 text-primary">注册</div>}
                <div className="h-3c" />
                <Form BandTemplate={FormBandTemplate1} onValuesChanged={onValuesChanged}>
                    <BandString name="user" label={accountLable} placeholder="手机号或邮箱" />
                    <Band contentContainerClassName='mt-3 d-flex justify-content-center'>
                        <Submit name="submit" onSubmit={onSubmit} disabled={true}>发送验证码</Submit>
                    </Band>
                </Form>
                <div className="text-center py-3">
                    <a href="/#" className="text-primary"
                        onClick={onToLogin}
                    >已有账号，直接登录</a>
                </div>
            </div>
        </div>
    </UPage>;
}

export function Register(props: StartProps) {
    let { loginTop, privacy } = props;
    let accountError = (isExists: number) => {
        if (isExists > 0) return '已经被注册使用了';
    }
    return <RegisterPageBase header="注册账号" accountLable="账号" Password={RegisterPassword}
        accountError={accountError} sendVerifyOem={undefined}
        loginTop={loginTop} privacy={privacy} />;
}

export function Forget(props: StartProps) {
    let { loginTop, privacy } = props;
    let accountError = (isExists: number) => {
        if (isExists === 0) return '请输入正确的账号';
    }
    return <RegisterPageBase header="密码找回" accountLable="账号" Password={ForgetPassword}
        accountError={accountError} sendVerifyOem={undefined}
        loginTop={loginTop} privacy={privacy} />;
}
