import { UPage, useNav } from 'tonwa-com';
import { Form } from 'tonwa-com';
import { User } from 'tonwa-uq';
import { BandString, ruleIsRequired } from 'tonwa-com';
import { Submit } from 'tonwa-com';
import { BandPassword } from 'tonwa-com';
import { FormBandTemplate1 } from 'tonwa-com';
import { Band } from 'tonwa-com';
import { FormErrors } from 'tonwa-com';
import { useUqAppBase } from '../UqApp';
import { Forget, Register } from './register/Register';
import { getSender } from './tools';

/*
const schema: Schema = [
    { name: 'username', type: 'string', required: true, maxLength: 100 } as StringSchema,
    { name: 'password', type: 'string', required: true, maxLength: 100 } as StringSchema,
    { name: 'login', type: 'submit' },
];
*/

interface Props {
    withBack?: boolean;
    loginTop?: JSX.Element;
    privacy: JSX.Element;
    callback?: (user: User) => Promise<void>
}

export function Login({ withBack, loginTop, privacy, callback }: Props) {
    let nav = useNav();
    let uqApp = useUqAppBase();
    let { userApi, guest } = uqApp;
    let onLogin = async (un: string, pwd: string): Promise<boolean> => {
        let user = await userApi.login({
            user: un,
            pwd: pwd,
            guest,
        });

        if (user === undefined) return false;
        console.log("onLoginSubmit: user=%s pwd:%s", user.name, user.token);
        await uqApp.logined(user);
        await callback?.(user);
        return true;
    }

    let onSubmit = async (values: any): Promise<string> => {
        let un = values['username'];
        let pwd = values['password'];
        if (pwd === undefined) {
            return 'something wrong, pwd is undefined';
        }
        let ret = await onLogin(un, pwd);
        if (ret === true) return;

        let sender = getSender(un);
        let type: string = sender !== undefined ? sender.caption : '用户名';
        return type + '或密码错！';
    }
    /*
    let onEnter = async (name: string, context: Context): Promise<string> => {
        if (name === 'password') {
            return await onSubmit('login', context);
        }
    }
    */
    let header = withBack === true ? '登录' : false

    return <UPage header={header} footer={privacy}>
        <div className="d-flex p-5 flex-column justify-content-center align-items-center">
            <div className="flex-fill" />
            <div className="w-20c">
                {loginTop ?? <div className="text-center p-3 fs-5 text-primary">登录</div>}
                <div className="h-2c" />
                <Form BandTemplate={FormBandTemplate1}>
                    <BandString label="登录账号" name="username"
                        placeholder="手机/邮箱/用户名" rule={ruleIsRequired}
                        maxLength={100} />
                    <BandPassword label="密码" name="password"
                        placeholder="密码" rule={ruleIsRequired}
                        maxLength={100} />
                    <Band>
                        <FormErrors />
                    </Band>
                    <Band contentContainerClassName="text-center my-3">
                        <Submit onSubmit={onSubmit}><div className='mx-5'>登录</div></Submit>
                    </Band>
                </Form>
                <div className="text-center">
                    <button className="btn btn-link" onClick={() => nav.open(<Forget loginTop={loginTop} privacy={privacy} />)}>
                        忘记密码
                    </button>
                    <button className="btn btn-link" onClick={() => nav.open(<Register loginTop={loginTop} privacy={privacy} />)}>
                        注册账号
                    </button>
                </div>
            </div>
            <div className="flex-fill" />
            <div className="flex-fill" />
        </div>
    </UPage>;
}
