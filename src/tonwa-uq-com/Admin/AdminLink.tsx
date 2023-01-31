import { ReactNode, useCallback, useState } from "react";
import { useNav, Spinner, useEffectOnce } from "tonwa-com";
import { AdminPage } from "./AdminPage";

export enum EnumAdminRoleInEdit { sys = 1, admin = 2, nSys = -1, nAdmin = -2, }

export interface Admin {
    id: number;
    role: EnumAdminRoleInEdit;
    operator: number;
    create: number;
    update: number;
    user: number;
    assigned: string;
}

interface FuncProps {
    setMeAdmin: () => Promise<void>;
    setAdmin: (user: number, role: number, assigned: string) => Promise<void>;
}

export interface AdminProps extends FuncProps {
    meAdmin: Admin;
    sysAdmins: Admin[];
    admins: Admin[];
    me: number;
}

interface Props extends FuncProps {
    children: React.ReactNode;
    me: number;
    loadAdmins: () => Promise<any[]>;
    LinkContainer: (props: { onClick: () => void; children: ReactNode; }) => JSX.Element;
}

interface AdminState {
    meAdmin: Admin;
    sysAdmins: Admin[];
    admins: Admin[];
}

// role: 1=系统管理员，可以多个；2=业务管理员，管理角色，不能更改系统管理员
// role = -1: 暂停系统管理员，24小时内，可以自己恢复。超过24小时，不可以自己恢复
// 也许以后需要其它的角色
// 这个管理员只能通过admins来设置
export function AdminLink({ LinkContainer, me, loadAdmins, setAdmin, setMeAdmin, children }: Props) {
    let nav = useNav();
    const [adminState, setAdminState] = useState<AdminState>(null);

    let load = useCallback(async (): Promise<void> => {
        let retAdmins = await loadAdmins();
        if (!retAdmins) {
            setAdminState(undefined);
            return;
        }
        //await this.loadUserNames(retAdmins);
        let state: AdminState = {
            meAdmin: undefined,
            sysAdmins: [],
            admins: [],
        };
        for (let admin of retAdmins) {
            let { id } = admin;
            if (id === me) {
                state.meAdmin = admin;
                continue;
            }
            let { role } = admin;
            switch (role) {
                case -1:
                    break;
                case 1:
                    state.sysAdmins.push(admin);
                    break;
                case 2:
                    state.admins.push(admin);
                    break;
            }
        }
        setAdminState(state);
    }, [me, loadAdmins]);
    useEffectOnce(() => {
        load();
    });

    if (adminState === null) {
        return <LinkContainer onClick={() => null}><Spinner /><span /></LinkContainer>;
    }
    if (adminState === undefined) {
        return null;
    }
    let { meAdmin, sysAdmins, admins } = adminState;
    if (meAdmin === undefined) return null;

    let onClick = async () => {
        function nSetAdmin(user: number, role: number, assigned: string) {
            return setAdmin(user, role, assigned);
        }
        function nSetMeAdmin() {
            setAdminState({
                meAdmin,
                sysAdmins: undefined,
                admins: undefined,
            });
            return setMeAdmin();
        }
        if (adminState.sysAdmins === undefined) {
            await load();
        }
        nav.open(
            <AdminPage meAdmin={meAdmin} sysAdmins={sysAdmins} admins={admins}
                me={me}
                setAdmin={nSetAdmin} setMeAdmin={nSetMeAdmin} />
        )
    }
    return <LinkContainer onClick={onClick}>{children}</LinkContainer>;
}
