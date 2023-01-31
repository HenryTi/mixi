import { MiAccount } from "app/stores/MiAccount";
import { Link, useOutlet, useOutletContext } from "react-router-dom";
import { Page, useNav } from "tonwa-com";
import { pathAccountBuy } from "./routeAccount";

export function ButtonBuy() {
    return <Link
        className="btn btn-outline-primary me-3"
        to={pathAccountBuy}>买股</Link>;
}

export function PageAccountBuy() {
    const miAccount = useOutletContext<MiAccount>();
    return <Page header="买股">
        买股 {miAccount.state.name}
    </Page>;
};
