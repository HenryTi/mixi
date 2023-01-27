import { MouseEvent } from "react";
import { UPage, useNav } from "tonwa-com";

export function PrivacyLink() {
    let nav = useNav();
    function onClick(evt: MouseEvent<HTMLAnchorElement>) {
        evt.preventDefault();
        nav.open(<PrivacyPage />);
    }
    return <div className="d-flex p-3 align-items-center justify-content-center bg-light border-top">
        <a href="/#" className="small d-inline-block " onClick={onClick}>
            隐私政策
        </a>
    </div>;
}

function PrivacyPage() {
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
