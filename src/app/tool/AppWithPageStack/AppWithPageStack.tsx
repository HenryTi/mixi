import { useAppNav } from "tonwa-com";
import { useSnapshot } from "valtio";
import { AppLogin } from "./AppImage";
import { MainPage } from "../../MainPage";

export function AppWithPageStack() {
    let appNav = useAppNav();
    let { isLogined } = useSnapshot(appNav.response);
    if (isLogined !== true) {
        return <AppLogin />;
    }
    return <MainPage />;
}
