import { useNav, Page, LMR } from "tonwa-com";
import { AdminProps } from "./AdminLink";
import { cnBg, cnMYLg, cnRow, cnSmallMuted, faInfo } from "./consts";

export function MeSysAdminPage(props: AdminProps) {
    let nav = useNav();
    let { meAdmin, sysAdmins, setMeAdmin } = props;

    function content() {
        switch (meAdmin.role) {
            default: return null;
            case -1: return renderQuiting();
            case 1: return renderAm();
        }
    }
    function showMeSysAdmin() {
        nav.open(<MeSysAdminPage {...props} />);
    }
    let onMeSystemAdmin = async () => {
        await setMeAdmin();
        let { role } = meAdmin;
        meAdmin.role = -role;
        meAdmin.update = Date.now() / 1000;
        nav.close();
    }
    function renderQuiting() {
        let { update } = meAdmin;
        let dateUpdate = new Date(update * 1000);
        let dateUpdateNextDay = new Date((update + 24 * 3600) * 1000);
        return <div>
            <LMR className={cnRow + cnBg + cnMYLg + ' text-danger cursor-pointer'}
                onClick={showMeSysAdmin}>
                <div className="d-flex justify-content-center p-3">
                    {faInfo}<b>I am quiting system admim</b>
                </div>
                <div className={cnSmallMuted + ' my-3 d-flex justify-content-center '}>
                    You quit at {dateUpdate.toLocaleDateString()} {dateUpdate.toLocaleTimeString()},
                    can restore before {dateUpdateNextDay.toLocaleDateString()} {dateUpdateNextDay.toLocaleTimeString()}
                </div>
            </LMR>
            <div className="pt-3">
                <div className="d-flex justify-content-center my-3">
                    <button className="btn btn-outline-primary"
                        onClick={onMeSystemAdmin}>
                        Restore system admin
                    </button>
                </div>
            </div>
        </div>;
    }

    function renderAm() {
        return <div>
            <div className={cnRow + cnBg + cnMYLg + ' text-danger cursor-pointer text-center mt-5'}
                onClick={showMeSysAdmin}>
                {faInfo}<b>I am a system admim</b>
            </div>
            <div className="pt-3">
                <div className="d-flex justify-content-center my-3">
                    <button className="btn btn-outline-primary"
                        disabled={sysAdmins.length === 0}
                        onClick={onMeSystemAdmin}>
                        Quit system admin
                    </button>
                </div>
                <div className="d-flex justify-content-center my-3">
                    <div className={cnSmallMuted}>You can restore in 24 hours after quiting</div>
                </div>
            </div>
        </div>;
    }

    return <Page header="System admin">
        {content()}
    </Page>;
}
