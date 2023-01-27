import { useUqApp } from "app/MyUqApp";
import { FA, LMR, Page, Sep, useNav, useT } from "tonwa-com";
import { Image } from "tonwa-uq-com";
import { useSnapshot } from "valtio";
import { appT } from "../../res";
import { PageAbout } from "./PageAbout";
import { PageEditMe } from "./PageEditMe";

export function TabMe() {
    const t = useT(appT);
    const nav = useNav();
    const uqApp = useUqApp();
    const { user } = useSnapshot(uqApp.uqAppState);

    function MeInfo() {
        if (!user) return null;
        let { id, name, nick, icon } = user;
        return <LMR className="py-3 px-3 cursor-pointer w-100"
            onClick={() => nav.open(<PageEditMe />)}>
            <Image className="w-3c h-3c me-3" src={icon || '.user-o'} />
            <div>
                <div>{userSpan(name, nick)}</div>
                <div className="small"><span className="text-muted">ID:</span> {id > 10000 ? id : String(id + 10000).substring(1)}</div>
            </div>
            <FA className="align-self-end" name="angle-right" />
        </LMR>;
    }

    function onAbout() {
        nav.open(<PageAbout />)
    }

    function AboutLink() {
        return <LMR className="w-100 py-3 px-3 align-items-center" onClick={onAbout}>
            <FA className="text-info me-3" name="smile-o" fixWidth={true} size="lg" />
            <b className="">{t('aboutTheApp')} <small>{t('version')} {uqApp.version}</small></b>
            <FA className="align-self-center" name="angle-right" />
        </LMR>;
    }
    return <Page header={t('me')}>
        <div>
            <MeInfo />
            <Sep />
            <AboutLink />
            <Sep />
        </div>
    </Page>;
}


function userSpan(name: string, nick: string): JSX.Element {
    return nick ?
        <><b>{nick} &nbsp; <small className="muted">{name}</small></b></>
        : <b>{name}</b>
}
