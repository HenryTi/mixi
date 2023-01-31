import { useAppNav } from "tonwa-com";
import { useSnapshot } from "valtio";
import { AppLogin } from "./AppImage";
import { MainPage } from "../../MainPage";

export function AppWithPageStack() {
    let appNav = useAppNav();
    let { isLogined } = useSnapshot(appNav.response);
    console.log('isLogined', isLogined);
    if (isLogined !== true) {
        return <AppLogin />;
    }
    return <MainPage />;
}
