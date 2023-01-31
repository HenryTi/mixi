import { FA, LMR, Page, useNav } from "tonwa-com";
import { User } from "tonwa-uq";
import { UserView } from "../coms";
import { SelectUser } from "../coms/SelectUser";
import { Admin, AdminProps, EnumAdminRoleInEdit } from "./AdminLink";
import { UserPage, UserTemplate } from "./UserPage";
import { MeSysAdminPage } from "./MeSysAdminPage";
import { cnBg, cnMYLg, cnRow, faInfo } from "./consts";
import { ListEdit } from "../ListEdit";
import { ListEditContext, useListEdit } from "../ListEdit";

export function AdminPage(props: AdminProps) {
    let nav = useNav();
    let { me, meAdmin, sysAdmins, admins, setAdmin } = props;
    let showMeSysAdmin = () => {
        nav.open(<MeSysAdminPage {...props} />);
    }

    let onUser = async (admin: Admin, listEditContext: ListEditContext<Admin>) => {
        async function setAdminUser(assigned: string) {
            let { id, role } = admin;
            await setAdmin(id, role, assigned);
            listEditContext.onItemChanged({ ...admin, assigned });
        }
        async function delAdmin() {
            let { id, role } = admin;
            await setAdmin(id, -role, null);
            listEditContext.onItemDeleted(admin);
        }
        nav.open(<UserPage me={me} admin={admin} setAdmin={setAdminUser} delAdmin={delAdmin} />);
    }

    function Me(): JSX.Element {
        switch (meAdmin.role) {
            default: return null;
            case EnumAdminRoleInEdit.nSys:
                return <MeSystemAdmin quiting={true} />;
            case EnumAdminRoleInEdit.sys:
                return <MeSystemAdmin quiting={false} />;
            case EnumAdminRoleInEdit.admin:
                return <div className={cnRow + cnBg + cnMYLg}>
                    {faInfo} I am an admin
                </div>;
        }
    }

    function MeSystemAdmin({ quiting }: { quiting: boolean }) {
        let msg = quiting === true ?
            'I am quiting system admin'
            :
            'I am a system admin';
        return <LMR className={'px-3 py-3 align-items-center text-danger cursor-pointer border-top border-bottom'}
            onClick={showMeSysAdmin}>
            {faInfo}
            <b>{msg}</b>
            <FA name="angle-right" />
        </LMR>;
    }

    /*
    function SysAdmins(): JSX.Element {
        const listEditContext = useListEdit(sysAdmins, (item1, item2) => item1.id === item2.id);
        switch (meAdmin.role) {
            case EnumAdminRoleInEdit.nSys: return null;
            case EnumAdminRoleInEdit.admin: return null;
        }

        return <div className="m-3 border rounded-3 border-2">
            <div className={cnRow + ' small bg-light border-bottom rounded-top rounded-3'}>
                <LMR className="align-items-end">
                    <div>System admins</div>
                    <div className="ms-3 small text-muted">System admin is an admin, and can add or delete admin</div>
                    <Add role={EnumAdminRoleInEdit.sys} />
                </LMR>
            </div>
            <ListEdit context={listEditContext} ItemView={AdminItem} onItemClick={admin => onUser(admin, listEditContext)} />
        </div>;
    }
    */
    function Admins({ list, enumAdminRoleInEdit, caption, memo }:
        { list: Admin[]; enumAdminRoleInEdit: EnumAdminRoleInEdit; caption: string; memo: string; }) {
        const listEditContext = useListEdit(list, (item1, item2) => item1.id === item2.id);
        switch (meAdmin.role) {
            case EnumAdminRoleInEdit.nSys: return null;
            case EnumAdminRoleInEdit.admin: return null;
        }
        async function onAddAdmin() {
            let captionSelectUser = 'Add ' + (enumAdminRoleInEdit === EnumAdminRoleInEdit.sys ? 'system admin' : 'admin');
            //let cSelectUser = new CUser(this.nav, captionSelectUser, this)
            //let ret = await this.app.cUser.select<Admin>(captionSelectUser);
            let ret = await nav.call<User>(<SelectUser header={captionSelectUser} />);
            // let ret = await this.call<any, CAdminBase>(VAddUser, role);
            if (!ret) return;
            let { id: user, assigned } = ret;
            await setAdmin(user, enumAdminRoleInEdit, assigned);
            let tick = Date.now() / 1000;
            let admin: Admin = {
                id: user,
                user,
                role: enumAdminRoleInEdit,
                operator: undefined,
                assigned,
                create: tick,
                update: tick,
            }
            let listAdd: Admin[], listDel: Admin[];
            if (enumAdminRoleInEdit === 1) {
                listAdd = sysAdmins;
                listDel = admins;
            }
            else {
                listAdd = admins;
                listDel = sysAdmins;
            }
            listAdd.unshift(admin);
            removeAdmin(listDel, admin);
        }

        function removeAdmin(list: Admin[], admin: Admin) {
            let p = list.findIndex(v => v.id === admin.id);
            if (p >= 0) list.splice(p, 1);
        }
        return <div className="m-3 border rounded-3 border-2">
            <div className="pt-2 pb-1 ps-3 pe-1 small bg-light border-bottom rounded-top rounded-3">
                <LMR className="align-items-end">
                    <div><b>{caption}</b></div>
                    <div className="ms-4 small text-muted">{memo}</div>
                    <button className="btn btn-sm btn-outline-success" onClick={onAddAdmin}>
                        <FA name="plus" />
                    </button>
                </LMR>
            </div>
            <ListEdit context={listEditContext} ItemView={AdminItem} onItemClick={admin => onUser(admin, listEditContext)} />
        </div>;
    }

    function AdminItem({ value: admin }: { value: Admin; }) {
        let { id, assigned } = admin;
        return <UserView id={id} assigned={assigned} Template={UserTemplate} />;
    }

    return <Page header="Admin">
        <div>
            <Me />
            <Admins list={sysAdmins}
                enumAdminRoleInEdit={EnumAdminRoleInEdit.sys}
                caption="System admins"
                memo="System admin is an admin, and can add or delete admin" />
            <Admins list={admins}
                enumAdminRoleInEdit={EnumAdminRoleInEdit.admin}
                caption="Admins"
                memo="Admin can define user roles" />
        </div>
    </Page>;
}

/*
import { User } from "tonwa-con troller";
import { FA, Image, List, LMR } from "tonwa-reac t";
import { Admin, EnumAdminRoleInEdit } from ".";
import { VPage } from "../VPage";
import { CAdminBase } from "./PAdmin";

const cnRow = ' px-3 py-2 ';
const cnBg = ' bg-white ';
const cnMYLg = ' my-2 ';
const cnMYSm = ' my-1 ';
//const cnSmallMuted = ' small text-muted ';
const info = <FA className="text-primary me-3" name="info-circle" size="lg" />;

export class VStart extends VPage<CAdminBase> {
    header(): string | boolean | JSX.Element {
        return 'Admin';
    }

    content() {
        return this.react(() => {
            return <div>
                {this.renderMe()}
                {this.renderSysAdmins()}
                {this.renderAdmins()}
            </div>
        });
    }

    private renderMe(): JSX.Element {
        let { deep } = this.controller;
        let { meAdmin } = deep;
        switch (meAdmin.role) {
            default: return null;
            case EnumAdminRoleInEdit.nSys: return this.renderMeSystemAdmin(true);
            case EnumAdminRoleInEdit.sys: return this.renderMeSystemAdmin(false);
            case EnumAdminRoleInEdit.admin:
                return <div className={cnRow + cnBg + cnMYLg}>
                    {info} I am an admin
                </div>;
        }
    }

    private renderMeSystemAdmin(quiting: boolean) {
        let rightAngle = <FA name="angle-right" />;
        let msg = quiting === true ?
            'I am quiting system admin'
            :
            'I am a system admin';
        return <LMR className={cnRow + cnBg + cnMYLg + ' text-danger cursor-pointer'}
            onClick={this.controller.showMeSysAdmin}
            right={rightAngle}>
            {info}
            <b>{msg}</b>
        </LMR>;
    }

    private renderSysAdmins(): JSX.Element {
        let { deep } = this.controller;
        let { meAdmin } = deep;
        switch (meAdmin.role) {
            case EnumAdminRoleInEdit.nSys: return null;
            case EnumAdminRoleInEdit.admin: return null;
        }

        let { sysAdmins } = deep;
        return <div className="mt-3">
            <div className={cnRow + ' small '}>
                <LMR right={this.renderAdd(EnumAdminRoleInEdit.sys)} className="align-items-end">
                    <div>System admins</div>
                    <div className="small text-muted">System admin is an admin, and can add or delete admin</div>
                </LMR>
            </div>
            <List items={sysAdmins} item={{ render: this.renderAdminItem, onClick: this.controller.onUser }} />
        </div>;
    }

    private renderAdmins(): JSX.Element {
        let { deep } = this.controller;
        let { meAdmin } = deep;
        switch (meAdmin.role) {
            case EnumAdminRoleInEdit.nSys: return null;
            case EnumAdminRoleInEdit.admin: return null;
        }
        let { admins } = deep;
        return <div className="mt-3">
            <div className={cnRow + ' small'}>
                <LMR right={this.renderAdd(EnumAdminRoleInEdit.admin)} className="align-items-end">
                    <div>Admins</div>
                    <div className="small text-muted">Admin can define user roles</div>
                </LMR>
            </div>
            <List items={admins} item={{ render: this.renderAdminItem, onClick: this.controller.onUser }} />
        </div>;
    }

    private renderAdminItem = (admin: Admin, index: number) => {
        let { id, assigned } = admin;
        return this.controller.app.cUser.renderUser(id, (user: User) => {
            let { name, nick, icon } = user;
            let right = <FA name="angle-right" className="cursor-pointer" />;
            return <LMR key={id}
                className={cnRow + cnMYSm + cnBg}
                left={<Image src={icon} className="me-4 align-self-start w-2-5c h-2-5c" />}
                right={right}>
                {
                    assigned && <div>
                        <small className="text-muted me-3">Remark:</small>
                        {assigned}
                    </div>
                }
                <div><small className="text-muted me-3">Name:</small>{name}</div>
                <div><small className="text-muted me-3">Nick:</small>{nick}</div>
            </LMR>;
        });
    }

    renderAdd(role: EnumAdminRoleInEdit): JSX.Element {
        return <button className="btn btn-sm btn-outline-success" onClick={() => this.controller.onAddAdmin(role)}>
            <FA name="plus" />
        </button>;
    }
}
*/