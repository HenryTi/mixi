import { Page, Waiting } from "tonwa-com";
import { EnumSysRole } from "tonwa-uq";
import { usePageStoreInit } from "../PageStore";
//import { useUqStoreInit } from 'tonwa-uq-com';
import { ViewAdmin } from "./admin/ViewAdmin";
import { ViewOwner } from "./owner";
import { roleT } from "./res";
import { ViewRoles } from "./roles";
import { UnitRoleStore } from "./UnitRoleStore";


interface Props {
    admin: EnumSysRole, // 'admin' | 'owner';
    onAdminChanged: () => Promise<void>;
    viewTop: JSX.Element;
}

export function PageUnitRoleAdmin({ admin, onAdminChanged, viewTop }: Props) {
    let store = usePageStoreInit(() => new UnitRoleStore());
    let { uqApp, state } = store;
    let { unitRoles } = state;
    if (unitRoles === undefined) return <Waiting />;
    store.onAdminChanged = onAdminChanged;

    let { isOwner, isAdmin } = uqApp.userUnit;
    return <Page header={roleT(admin === EnumSysRole.admin ? 'admin' : 'owner')}>
        {viewTop}
        {isOwner === true && <>
            <ViewOwner />
            <ViewAdmin />
        </>}
        {isAdmin === true && <ViewRoles />}
    </Page>;
}

