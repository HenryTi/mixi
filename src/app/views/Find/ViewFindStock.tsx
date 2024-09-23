import { useUqApp } from "app/UqApp";
import { MGroup } from "app/stores/MGroup";
import { Link, useNavigate } from "react-router-dom";
import { FA, LMR, SearchBox } from "tonwa-com";
import { Page } from "tonwa-app";
import { pathSearch } from "../Search";
import { pathGroupStocks, pathMyAll, pathMyBlocks } from "./routeFind";
import { ViewGroups } from "./ViewGroups";
import { ViewStockList } from "./ViewStockList";
import { sortGroups, sorts } from "../PageSort";

const searchButtons: [string, string[]][] = [
    ['A股', ['sh', 'sz', 'bj']],
    ['港股', ['hk']],
    ['沪A', ['sh']],
    ['深A', ['sz']],
    ['京A', ['bj']],
    ['US', ['us']],
    ['全部', ['sh', 'sz', 'bj', 'hk', 'us']],
];

export function ViewFindStock() {
    const navigate = useNavigate();
    const uqApp = useUqApp();
    const { stocksMyAll, myAllCaption, stocksMyBlock, myBlockCaption, rootIndustries, miGroups, industries } = uqApp.storeApp;

    function renderMyAll() {
        return renderSpec(stocksMyAll?.length, myAllCaption, 'home', 'text-primary', pathMyAll);
    }

    function renderMyBlock() {
        return renderSpec(stocksMyBlock?.length,
            <>
                <span className="mr-3">{myBlockCaption}</span>
                <small className="text-muted">选股时不列出</small>
            </>,
            'ban', 'text-black', pathMyBlocks);
    }

    function renderSpec(count: number, text: string | JSX.Element, icon: string, color: string, to: string) {
        let cn = "align-self-center ms-3 " + color;
        return <Link className="mt-2 bg-white" to={to}>
            <LMR>
                <FA name={icon} className={cn} size="lg" fixWidth={true} />
                <div className="px-3 py-2">{text}</div>
                {count > 0 && <small className="align-self-center mx-3 text-muted">{count}</small>}
            </LMR>
        </Link>
    }
    async function onSearchFromKey(key: string) {
        navigate(pathSearch(), { state: { header: '搜索', searchKey: key } });
    }
    async function onGroupClick(group: MGroup) {
        navigate(pathGroupStocks(group.id));
    }
    async function onSortGroup(group: number) {
        navigate('/sort/' + group);
    }
    return <div className="bg-light">
        <div className="p-3">
            <SearchBox className="mb-0" onSearch={onSearchFromKey} placeholder="股票代码，名称" />
        </div>
        <div className="py-2 px-3 mb-2 d-flex flex-wrap bg-white border-top border-bottom">
            {searchButtons.map(v => {
                let [caption, markets] = v;
                function onSearchInMarkets() {
                    navigate(pathSearch(), { state: { header: caption, markets } });
                }
                return <button key={caption}
                    className="btn btn-outline-info m-1"
                    onClick={onSearchInMarkets}>
                    {caption}
                </button>;
            })}
        </div>
        {
            sortGroups.map(v => {
                const { caption, group, sorts } = v;
                return <div className="py-2 px-3 mb-2  bg-white border-top border-bottom">
                    <div className="small text-body-tertiary mb-2">{caption}</div>
                    <div key={group} className="d-flex flex-wrap">
                        {sorts.map((v, index) => {
                            return <button key={index}
                                className="btn btn-outline-primary m-1"
                                onClick={() => onSortGroup(group * 100 + index + 1)}>
                                {v.name}
                            </button>
                        })}
                    </div>
                </div>;
            })
            /*
            [
                { profix: '米息价值', group: 0 },
                { profix: '米息小盘优选', group: 100 },
                { profix: '毛息小盘', group: 200 },
            ].map(v => {
                const { profix, group } = v;
                let vContent: any;
                switch (group) {
                    default:
                        vContent = sorts.map((v, index) => {
                            return <button key={index}
                                className="btn btn-outline-primary m-1"
                                onClick={() => onSortGroup(group + index + 1)}>
                                {v.name}
                            </button>
                        });
                        break;
                    case 200:
                        vContent = <button
                            className="btn btn-outline-primary m-1"
                            onClick={() => onSortGroup(group + 1)}>
                            标普500
                        </button>
                        break;
                }
                return <div className="py-2 px-3 mb-2  bg-white border-top border-bottom">
                    <div className="small text-body-tertiary mb-2">{profix}</div>
                    <div key={group} className="d-flex flex-wrap">
                        {vContent}
                    </div>
                </div>;
            })
            */
        }

        <div className="mb-3 d-flex flex-column">
            {renderMyAll()}
        </div>

        <div className="small text-muted px-3 mb-1">分组</div>
        <div className=" mb-3 px-1 pb-1 bg-white border-top border-bottom">
            <ViewGroups miGroups={miGroups} onGroupClick={onGroupClick} />
        </div>
        <div className="small text-muted px-3 mt-2 mb-1">行业</div>
        <div className=" mb-3 px-1 pb-1 bg-white border-top border-bottom">
            <ViewGroups miGroups={industries} onGroupClick={onGroupClick} />
        </div>
        <div className="small text-muted px-3 mt-2 mb-1">门类</div>
        <div className=" mb-3 px-1 pb-1 bg-white border-top border-bottom">
            <ViewGroups miGroups={rootIndustries} onGroupClick={onGroupClick} />
        </div>
        <div className="mb-3">
            {renderMyBlock()}
        </div>
    </div>;
    /*
    <div className="py-2 px-3 mb-2 d-flex flex-wrap bg-white border-top border-bottom">
        {sorts.map((v, index) => {
            return <button key={index}
                className="btn btn-outline-primary m-1"
                onClick={() => onSortGroup(100 + index + 1)}>
                /{v.name}
            </button>
        })}
    </div>
    */
}

export function PageStocksMyAll() {
    const { storeApp } = useUqApp();
    const { myAllCaption, stocksMyAll } = storeApp;
    return <Page header={myAllCaption}>
        <ViewStockList stocks={stocksMyAll} />
    </Page>;
}

export function PageStocksMyBlock() {
    const { storeApp } = useUqApp();
    const { myBlockCaption, stocksMyBlock } = storeApp;
    return <Page header={myBlockCaption}>
        <ViewStockList stocks={stocksMyBlock} />
    </Page>;
}
