import { AppLogout } from "app/tool/AppWithTabs/AppImage";
import { Outlet, Route, Routes } from "react-router-dom";
import { ChangePassword, UserQuit } from "tonwa-uq-com";
import { PageAbout } from "./PageAbout";
import { PageEditMeIndex } from "./PageEditMe";

export function pathEditMe() { return '/editMe'; }

const pathIndex = '/';
export const pathChangePassword = '/changePassword';
export const pathLogout = '/logout';
export const pathUserQuit = '/quit';
export const pathAbout = '/about';

export const routeMe = <>
    <Route path={pathEditMe() + '/*'} element={<PageEditMeLayout />} />
    <Route path={pathAbout} element={<PageAbout />} />
    <Route path={pathLogout} element={<AppLogout />} />
    <Route path={pathUserQuit} element={<UserQuit />} />
</>;

export function PageEditMeLayout() {
    return <>
        <Outlet />
        <Routes>
            <Route path={pathIndex} element={<PageEditMeIndex />} />
            <Route path={pathChangePassword} element={<ChangePassword />} />
        </Routes>
    </>;
}
