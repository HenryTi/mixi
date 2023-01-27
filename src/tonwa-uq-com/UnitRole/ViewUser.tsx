import { useState } from "react";
import { useSnapshot } from "valtio";
import { Band, BandString, FA, Form, LMR, MutedSmall, Page, stringFormat, Submit, useNav } from "tonwa-com";
import { EnumSysRole, UserUnit } from "tonwa-uq";
import { Image } from "../coms";
import { usePageStore } from '../PageStore';
import { roleT } from "./res";
import { UnitRoleStore } from "./UnitRoleStore";

interface Props {
    userUnit: UserUnit;
}

export function ViewUser({ userUnit: userUnitInit }: Props) {
    let nav = useNav();
    let store = usePageStore<UnitRoleStore>();
    let { uqApp } = store;
    let { uqUnit } = uqApp;
    let [userUnit, setUserUnit] = useState(userUnitInit);
    let { name, icon, nick, assigned } = userUnit;
    let tUser = roleT('user');
    let tAdmin = roleT('admin');
    let tOwner = roleT('owner');
    let vNick: any;
    if (nick) {
        vNick = <span className="d-inline me-3">{nick}</span>;
    }

    let vAssignedUser = assigned ?
        <>
            <div>{assigned}</div>
            {
                nick ? <MutedSmall>{vNick} {tUser}: {name}</MutedSmall> : name
            }
        </>
        :
        (
            nick ? <>{vNick} <MutedSmall>{tUser}: {name}</MutedSmall></> : name
        );
    function onEdit() {
        function PageEdit() {
            let user = useSnapshot(uqApp.user);
            let { user: userId, isOwner, isAdmin, addBy } = userUnit;
            let pageHeader: string;
            if (isOwner === true) pageHeader = tOwner;
            else if (isAdmin === true) pageHeader = tAdmin;
            else pageHeader = tUser;
            async function onSubmit(data: any): Promise<[name: string, err: string][] | string[] | string | void> {
                let { assigned } = data;
                await uqUnit.addUser(userId, assigned);
                setUserUnit({ ...userUnit, assigned });
                nav.close();
                return;
            }
            function ButtonRemove({ admin }: { admin: EnumSysRole; }) {
                let caption: string;
                //let adminFlag: 1 | 2;
                if (admin === EnumSysRole.owner) {
                    caption = tOwner;
                    // adminFlag = 2;
                }
                else {
                    caption = tAdmin;
                    //adminFlag = 1;
                }
                async function onRemove() {
                    if (await nav.confirm(stringFormat(roleT('userReallyDelete'), caption, userUnit.name)) === true) {
                        await store.delAdmin(userId, admin);
                        nav.close();
                    }
                }
                let btnCaption = stringFormat(roleT('deleteThe'), caption);
                return <button onClick={onRemove} className="btn btn-sm btn-outline-primary">
                    {btnCaption}
                </button>;
            }
            let btnRemove: any;
            if (isOwner === true) {
                if (addBy === user.id) {
                    btnRemove = <ButtonRemove admin={EnumSysRole.owner} />;
                }
            }
            else if (isAdmin === true) {
                btnRemove = <ButtonRemove admin={EnumSysRole.admin} />;
            }

            return <Page header={pageHeader}>
                <LMR className="mb-3 p-3 border-bottom tonwa-bg-gray-1">
                    <div>{vAssignedUser}</div>
                    <span>{btnRemove}</span>
                </LMR>
                <Form values={userUnit} className="m-3">
                    <BandString name="assigned" label={roleT('assigned')} />
                    <Band contentContainerClassName="text-center my-3">
                        <Submit onSubmit={onSubmit}><div className='mx-5'>{roleT('save')}</div></Submit>
                    </Band>
                </Form>
            </Page>;
        }
        nav.open(<PageEdit />);
    }
    return <LMR className="my-2">
        <Image className="w-2c h-2c me-3" src={icon} />
        <div>
            {vAssignedUser}
        </div>
        <div className="cursor-pointer text-info" onClick={onEdit}>
            <FA name="pencil" />
        </div>
    </LMR>;
}
