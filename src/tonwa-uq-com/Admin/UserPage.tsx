import { useState } from "react";
import { Page, useNav, FA, Form } from "tonwa-com";
import { LMR, MutedSmall } from "tonwa-com";
import { String } from "tonwa-com";
import { Submit } from "tonwa-com";
import { User } from "tonwa-uq";
import { UserView, Image } from "../coms";
import { Admin, EnumAdminRoleInEdit } from "./AdminLink";
import { cnBg, cnMYSm, cnRow } from "./consts";

interface Props {
    me: number;
    admin: Admin;
    setAdmin: (assinged: string) => Promise<void>;
    delAdmin: () => Promise<void>;
}

export function UserTemplate({ user, assigned }: { user: User; assigned: string; }) {
    let { name, nick, icon } = user;
    return <LMR className={cnRow + cnMYSm + cnBg}>
        <Image src={icon} className="me-4 align-self-start w-2-5c h-2-5c" />
        <div>
            <div><b>{assigned ?? name}</b></div>
            <div>
                <span className="me-3">{assigned ? name : ''}</span>
                <MutedSmall className="text-muted me-3">{nick}</MutedSmall>
            </div>
        </div>
        <FA name="angle-right" className="cursor-pointer" />
    </LMR>;
};

export function UserPage({ admin, me, setAdmin, delAdmin }: Props) {
    let nav = useNav();
    let { id, role, operator, update } = admin;
    let [assigned, setAssigned] = useState(admin.assigned);
    let onDelAdmin = async () => {
        let ret = await nav.confirm('do you really want to delete the admin?');
        if (ret === true) {
            await delAdmin();
            /*
            let { role } = admin;
            await setAdmin(admin.id, -role, null);
            let list = role === 1 ? sysAdmins : admins;
            removeAdmin(list, admin);
            */
            nav.close();
        }
    }
    /*
    let removeAdmin = (list: Admin[], admin: Admin) => {
        let p = list.findIndex(v => v.id === admin.id);
        if (p >= 0) list.splice(p, 1);
    }
    */
    let onEditRemark = async () => {
        async function onSubmit(data: any) {
            let { assigned: newAssigned } = data;;
            await setAdmin(newAssigned);
            setAssigned(newAssigned)
            nav.close();
        }
        nav.open(<Page header="Remark">
            <Form values={admin}>
                <String name="assigned" />
                <Submit onSubmit={onSubmit} />
            </Form>
        </Page>)
        /*
        let cStringEdit = new CStringEdit(app, {
            itemSchema: { name: 'remark', type: 'string', required: true },
            uiItem: { widget: 'text', maxLength: 100, label: 'Remark' } as UiTextItem,
            value: admin.assigned,
            onChanged: async (fieldName: string, value: any) => {
                admin.assigned = value;
                let { id, role, assigned } = admin;
                await setAdmin(id, role, assigned);
            }
        });
        cStringEdit.onEdit();
        */
    }

    function UserTemplate({ user }: { user: User; }) {
        let { name, nick, icon } = user;
        let vDel: any;
        if ((role === EnumAdminRoleInEdit.sys && Date.now() / 1000 - update < 24 * 3600)
            || operator === me
            || role === EnumAdminRoleInEdit.admin) {
            vDel = <button className="btn btn-sm btn-outline-secondary" onClick={onDelAdmin}>
                Remove {role === EnumAdminRoleInEdit.sys ? 'system admin' : 'admin'}
            </button>;
        }

        return <div>
            <div className="d-flex border m-3 rounded-3 bg-white pe-5 py-4">
                <Image src={icon} className="mx-5 w-2-5c h-2-5c" />
                <div>
                    <div className="cursor-pointer"
                        onClick={() => onEditRemark()}>
                        <small className="text-muted me-3">Remark:</small>
                        {assigned ?? '-'}
                        <span className="ms-3">
                            <FA name="pencil-square-o" className="text-primary" />
                        </span>
                    </div>
                    <div><small className="me-3 text-muted">Name:</small> {name}</div>
                    <div><small className="me-3 text-muted">Nick:</small> {nick}</div>
                </div>
            </div>
            <div className="d-flex m-3 mt-4 justify-content-end">
                {vDel}
            </div>
        </div>
    }
    return <Page header=" ">
        <UserView id={id} assigned={assigned} Template={UserTemplate} />
    </Page>;
}
