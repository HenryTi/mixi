import { Link, Route, Routes } from "react-router-dom";
import { UPage, useNav } from "tonwa-com";

export const pathPrivacy = '/privacy';
export const routePrivacy = <>
    <Route path={pathPrivacy} element={<PagePrivacy />} />
</>;

export function PrivacyLink() {
    return <div className="d-flex p-3 align-items-center justify-content-center bg-light border-top">
        <Link to={pathPrivacy} className="small d-inline-block ">
            隐私政策
        </Link>
    </div>;
}

export function PagePrivacy() {
    return <UPage header="隐私政策">
        <div className="d-grid p-3">
            {privacy.split('\n').map((v, index) => <p key={index}>{v}</p>)}
        </div>
    </UPage>
}

const privacy = `
我们将保护您的隐私

同花
`;
