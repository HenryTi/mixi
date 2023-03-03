import { Link } from "react-router-dom";
import { Page } from "tonwa-app";
import { FA, LMR, Sep } from "tonwa-com";
import { pathContactList, pathContactNew } from "./Contact";
import { pathProductList, pathProductNew } from "./Product";
import { pathSheet } from "./Sheet/routeSheet";

interface Cmd {
    to: string;
    caption: string;
}
export function TabTrial() {
    const cmdProducts: Cmd[] = [
        { to: pathProductNew, caption: '新建产品' },
        { to: pathProductNew, caption: '新建产品2' },
    ]
    const cmdContacts: Cmd[] = [
        { to: pathContactNew, caption: '新建往来单位' },
        { to: pathContactNew, caption: '新建往来单位2' },
    ]
    function LinkCmd(cmd: Cmd, index: number) {
        const { to, caption } = cmd;
        return <Link key={index} to={to} className="px-3 py-3 border-bottom ">
            <FA name="chevron-circle-right" className="me-2 text-secondary" />
            {caption}
        </Link>;
    }
    return <Page header="测试" back="none">
        <div className="px-3 py-2 border-bottom small tonwa-bg-gray-1">测试页面</div>
        {cmdProducts.map((v, index) => LinkCmd(v, index))}
        <Link to={pathProductList} className="px-3 py-2 border-bottom align-items-center">
            产品列表
        </Link>
        <Link to={pathProductNew}>
            <LMR className="px-3 py-2 border-bottom align-items-center">
                <FA name="chevron-circle-right" className="me-2 text-secondary" />
                新建产品
                <span>
                    {10}
                    <FA name="angle-right" className="ms-2" />
                </span>
            </LMR>
        </Link>
        <Sep sep={3} />
        {cmdContacts.map((v, index) => LinkCmd(v, index))}
        <Link to={pathContactList} className="px-3 py-2 border-bottom align-items-center">
            往来单位列表
        </Link>
        <Sep sep={3} />
        <Link to={pathSheet} className="px-3 py-2 border-bottom align-items-center">
            新建单据
        </Link>
    </Page>;
}
