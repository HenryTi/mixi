import { Login, Register } from "tonwa-uq-com";
import { LoginTop, PrivacyLink } from "../brand";

export function AppLogin() {
    return <Login loginTop={<LoginTop />} privacy={<PrivacyLink />} withBack={false} />;
}

export function AppRegister() {
    return <Register loginTop={<LoginTop />} privacy={<PrivacyLink />} />;
}
