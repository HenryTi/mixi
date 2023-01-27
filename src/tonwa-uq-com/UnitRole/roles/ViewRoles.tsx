import { ReactNode } from "react";
import { useSnapshot } from "valtio";
import { LMR } from "tonwa-com";
import { UserUnit } from "tonwa-uq";
import { ListEdit, ListEditContext } from "../../ListEdit";
import { usePageStore } from '../../PageStore';
// import { None } from "App/tool";
import { ButtonAddUser } from "../ButtonAddUser";
import { roleT } from "../res";
import { UnitRoleStore } from "../UnitRoleStore";
import { ViewUser } from "../ViewUser";
import { None } from "../../coms";

export function ViewRoles(/*{ roleItems, users }: { roleItems: string[], users: UserUnit[] }*/) {
    let store = usePageStore<UnitRoleStore>();
    let { uqApp, state } = store;
    let { entity, unit } = uqApp.userUnit;
    let { unitRoles } = state;
    let roleItems = uqApp.uq.Role[unit === 0 ? '$' : entity];
    let { users } = unitRoles;

    let listEditContext = new ListEditContext(users, (item1, item2) => item1.user === item2.user);

    function ItemView({ value }: { value: UserUnit }) {
        let { roles, isAdmin, isOwner, user } = value;
        let uqAppUser = useSnapshot(uqApp.user);
        if (user === uqAppUser.id) return null;
        function RoleCheck({ caption, roleItem }: { caption: string; roleItem: string; }) {
            async function onCheckChange(evt: React.ChangeEvent<HTMLInputElement>) {
                await uqApp.uqUnit.setUserRole(
                    value.user,
                    (evt.currentTarget.checked === true) ? 'add' : 'del',
                    roleItem
                );
            }
            let defaultChecked = roles?.findIndex(v => v === roleItem) >= 0;
            return <label className="me-5">
                <input type="checkbox" className="form-check-input"
                    onChange={onCheckChange}
                    defaultChecked={defaultChecked} />
                <span>{caption}</span>
            </label>;
        }
        function Checked({ children }: { children: ReactNode; }) {
            return <label className="me-5">
                <input type="checkbox" className="form-check-input" checked={true} disabled={true} />
                <span>{children}</span>
            </label>;
        }
        let vRoles = <div className="ms-5 mt-2 form-check form-check-inline">{isOwner === true ?
            <Checked>roleT('owner')</Checked>
            : (
                isAdmin === true ?
                    <Checked>roleT('admin')</Checked>
                    :
                    roleItems.map(v => (<RoleCheck key={v} caption={uqApp.roleName(v).caption} roleItem={v} />))
            )
        }</div>;
        return <div className="px-3 py-2">
            <ViewUser userUnit={value} />
            {vRoles}
        </div >;
    }
    async function onUserAdded(user: number) {
        let assigned: string = undefined;
        let retUser = await uqApp.uqUnit.addUser(user, assigned);
        let { items } = listEditContext;
        let index = items.findIndex(v => v.user === user);
        if (index >= 0) {
            items.splice(index, 1);
        }
        listEditContext.setItems(
            [{
                ...retUser,
                id: 0,
                user,
                unit: 0,
                admin: 0
            } as any, ...items]
        );
    }
    return <>
        <div className="card mt-3 mx-1">
            <div className="card-header pe-0 py-0">
                <LMR className="align-items-center">
                    <span>{roleT('user')}</span>
                    <ButtonAddUser onUserAdded={onUserAdded} />
                </LMR>
            </div>
            <ListEdit context={listEditContext} ItemView={ItemView} none={<None />} />
        </div>
    </>;
}
