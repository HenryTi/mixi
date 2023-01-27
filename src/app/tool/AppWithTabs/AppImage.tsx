import { Login, Logout, Register } from "tonwa-uq-com";
import { LoginTop, PrivacyLink } from "../brand";

export function AppLogin() {
    return <Login loginTop={<LoginTop />} privacy={<PrivacyLink />} withBack={false} />;
}

export function AppRegister() {
    return <Register loginTop={<LoginTop />} privacy={<PrivacyLink />} />;
}

export function AppLogout() {
    let onLogout = async () => {
        //alert('logout');
    }
    let resetAll = () => {
        alert('reset all');
    }
    return <Logout onLogout={onLogout} resetAll={resetAll} />;
}
