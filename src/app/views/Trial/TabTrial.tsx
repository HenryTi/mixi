import { Link } from "react-router-dom";
import { Page } from "tonwa-app";
import { FA, LMR } from "tonwa-com";
import { pathProductList, pathProductNew } from "./routeTrial";

interface Cmd {
    to: string;
    caption: string;
}
export function TabTrial() {
    const cmds: Cmd[] = [
        { to: pathProductNew, caption: '新建产品' },
        { to: pathProductNew, caption: '新建产品2' },
        { to: pathProductNew, caption: '新建产品3' },
        { to: pathProductNew, caption: '新建产品4' },
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
        {cmds.map((v, index) => LinkCmd(v, index))}
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
        <Link to={pathProductNew} className="px-3 py-2 border-bottom ">新建产品</Link>
        <Link to={pathProductNew} className="px-3 py-2 border-bottom ">新建产品</Link>
        <Link to={pathProductNew} className="px-3 py-2 border-bottom ">新建产品</Link>
    </Page>;
}
