import { useSnapshot } from "valtio";
import { LMR } from "tonwa-com";
import { propertyOf, UserUnit } from "tonwa-uq";
import { ListEdit, ListEditContext } from "../../ListEdit";
import { usePageStore } from '../../PageStore';
import { ButtonAddUser } from "../ButtonAddUser";
import { None } from "../defines";
import { Me } from "../Me";
import { roleT } from "../res";
import { UnitRoleStore } from "../UnitRoleStore";
import { ViewUser } from "../ViewUser";

export function ViewAdmin() {
    let store = usePageStore<UnitRoleStore>();
    let { state, onAdminAdded } = store;
    let user = useSnapshot(store.uqApp.user);
    let { unitRoles } = state;
    let { admins } = unitRoles;
    let listEditContext = new ListEditContext<UserUnit>(admins, propertyOf<UserUnit>('unit'));
    let tAdmin = roleT('admin');
    function ItemView({ value }: { value: UserUnit }) {
        if (value.user === user.id) return <Me />;
        return <div className="px-3 py-2">
            <ViewUser userUnit={value} />
        </div>;
    }

    return <>
        <div className="card mt-3 mx-1">
            <div className="card-header pe-0 py-0">
                <LMR className="align-items-center">
                    <span>{tAdmin}</span>
                    <ButtonAddUser onUserAdded={onAdminAdded} />
                </LMR>
            </div>
            <ListEdit context={listEditContext} none={<None />} ItemView={ItemView} />
        </div>
        <ul className="small text-muted mt-2 mb-5 mx-3">
            <li>{roleT('adminMemo1')}</li>
            <li>{roleT('adminMemo2')}</li>
        </ul>
    </>;
}
