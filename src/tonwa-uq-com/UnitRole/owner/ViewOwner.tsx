import { useSnapshot } from "valtio";
import { FA, LMR, Page, useNav } from "tonwa-com";
import { propertyOf, UserUnit } from "tonwa-uq";
import { useUqAppBase } from "../../UqApp";
import { ListEdit, ListEditContext } from "../../ListEdit";
import { usePageStore } from "../../PageStore";
import { ButtonAddUser } from "../ButtonAddUser";
import { None } from "../defines";
import { Me } from "../Me";
import { roleT } from "../res";
import { UnitRoleStore } from "../UnitRoleStore";
import { ViewUser } from "../ViewUser";

export function ViewOwner() {
    let nav = useNav();
    let uqApp = useUqAppBase();
    let user = useSnapshot(uqApp.user);
    let store = usePageStore<UnitRoleStore>();
    let { state, onOwnerAdded } = store;
    let { unitRoles } = state;
    let { owners } = unitRoles;

    let listEditContext = new ListEditContext<UserUnit>(owners, propertyOf<UserUnit>('unit'));
    let tOwner = roleT('owner');

    function ItemView({ value }: { value: UserUnit }) {
        function iQuitOwner() {
            function PageIQuitOwner() {
                async function confirmQuit() {
                    await store.quitOwner();
                    nav.close(2);
                }
                return <Page header={tOwner}>
                    <div className="w-20c rounded border px-3 py-4 mx-auto my-3 text-center">
                        <LMR>
                            <FA name="question-circle-o" size="3x" className="text-danger me-3" />
                            <div className="text-start">
                                <b>{roleT('ownerReallyQuit')}</b>
                                <br />
                                <small className="text-muted">{roleT('ownerLost')}</small>
                                <br />
                                <br />
                                <button className="btn btn-outline-primary" onClick={confirmQuit}>{roleT('ownerConfirmQuit')}</button>
                            </div>
                            <span></span>
                        </LMR>
                    </div>
                </Page>;
            }
            nav.open(<PageIQuitOwner />);
        }
        if (value.user === user.id) {
            let vIQuitOwner: any;
            if (owners.length > 1) {
                vIQuitOwner = <span className="cursor-pointer" onClick={iQuitOwner}>
                    <FA name="times" className="text-info" />
                </span>;
            }
            return <Me right={vIQuitOwner} />;
        }
        return <div className="px-3 py-2">
            <ViewUser userUnit={value} />
        </div>;

    }

    return <>
        <div className="card mt-3 mx-1">
            <div className="card-header pe-0 py-0">
                <LMR className="align-items-center">
                    <span>{tOwner}</span>
                    <ButtonAddUser onUserAdded={onOwnerAdded} />
                </LMR>
            </div>
            <ListEdit context={listEditContext} none={<None />} ItemView={ItemView} />
        </div>
        <ul className="small text-muted mt-2 mb-5 mx-3">
            <li>{roleT("ownerMemo1")}</li>
            <li>{roleT("ownerMemo2")}</li>
        </ul>
    </>;
}
