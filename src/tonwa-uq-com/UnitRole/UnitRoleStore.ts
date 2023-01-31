import { EnumSysRole, UnitRoles } from "tonwa-uq";
import { UqApp } from "tonwa-uq-com/UqApp";
import { PageStore } from "../PageStore";
// import { /*Store, */UqApp, UqStore } from "tonwa-uq-com";
//import { UqStore } from 'tonwa-uq-com';

export interface State {
    unitRoles: UnitRoles;
}

export class UnitRoleStore extends PageStore<UqApp> {
    state: { unitRoles: UnitRoles; };

    async init() {
        let ret = await this.uqApp.uqUnit.loadUnitUsers();
        this.state.unitRoles = ret; //.setState({ unitRoles: ret });
    }

    // get me() { return this.uqApp.responsive.user?.id; }

    onAdminChanged: () => Promise<void>;

    private reloadAdmin = async () => {
        await this.onAdminChanged?.();
        await this.init();
    }

    onAdminAdded = async (userId: number) => {
        let admin: EnumSysRole = EnumSysRole.admin;
        await this.uqApp.uqUnit.addAdmin(userId, admin, undefined);
        this.reloadAdmin();
    }

    onOwnerAdded = async (userId: number) => {
        let admin: EnumSysRole = EnumSysRole.owner | EnumSysRole.admin;
        await this.uqApp.uqUnit.addAdmin(userId, admin, undefined);
        this.reloadAdmin();
    }

    quitOwner = async () => {
        await this.uqApp.uqUnit.quitOwner();
        await this.reloadAdmin();
    }

    delAdmin = async (userId: number, admin: EnumSysRole) => {
        await this.uqApp.uqUnit.delAdmin(userId, admin);
        this.reloadAdmin();
    }
}
