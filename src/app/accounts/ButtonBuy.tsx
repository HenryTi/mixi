import { MiAccount } from "app/stores/MiAccount";
import { Page, useNav } from "tonwa-com";

export function ButtonBuy({ account }: { account: MiAccount }) {
    const nav = useNav();
    function showBuy() {
        let footer = <div>
            ok
        </div>;
        nav.open(<Page header="买" footer={footer}>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
            <div>dddd</div>
        </Page>);
    }
    return <button className="btn btn-outline-primary me-3" onClick={() => showBuy()}>买股</button>;
}

