import { Page } from "tonwa-com";
import { BandInt, Form } from "tonwa-com";
import { ruleIsRequired } from "tonwa-com";
import { Band, BandContainerContext } from "tonwa-com";
import { Submit } from "tonwa-com";
import { Pass } from './Pass';

type OnVerify = (verify: string) => Promise<number>;

interface Props {
    pass: Pass;
    onVerify: OnVerify;
}

export function Verify({ pass, onVerify }: Props) {
    let { type, account } = pass;

    let onSubmit = async (values: any): Promise<any> => {
        let verify = values['verify'];
        let ret = await onVerify(verify);
        if (ret === 0) {
            return [['verify', '验证码错误']];
        }
    }

    async function onValuesChanged({ name, value }: { name: string; value: any; }, context: BandContainerContext<any>) {
        let field = context.fields['submit'];
        if (field) {
            context.setDisabled('submit', (value as string).length > 0)
        }
    }

    let typeText: string, extra: any;
    switch (type) {
        case 'mobile': typeText = '手机号'; break;
        case 'email':
            typeText = '邮箱';
            extra = <><span className="text-danger">注意</span>: 有可能误为垃圾邮件，请检查<br /></>;
            break;
    }
    return <Page header="验证码">
        <div className="w-max-20c my-5 py-5"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            验证码已经发送到{typeText}<br />
            <div className="py-2 px-3 my-2 text-primary bg-light"><b>{account}</b></div>
            {extra}
            <div className="h-1c" />
            <Form onValuesChanged={onValuesChanged}>
                <BandInt name="verify" label="验证码" placeholder="请输入验证码"
                    maxLength={6} rule={ruleIsRequired} />
                <Band>
                    <Submit name="submit" disabled={true} onSubmit={onSubmit}>下一步 {'>'}</Submit>
                </Band>
            </Form>
        </div>
    </Page>;
}
