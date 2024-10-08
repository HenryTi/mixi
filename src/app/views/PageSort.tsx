import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Page, PageSpinner } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { List, useEffectOnce } from "tonwa-com";
import { pathStockInfo } from "./StockInfo";
import { useCallback, useState } from "react";

export const UseQueryOptions = {
    cacheTime: 100,
    refetchOnWindowFocus: false
};

const maxCount = 40;
interface Sort {
    name: string;
    aHead?: 'inc' | 'mi';
}

export const sorts: Sort[] = [
    { name: '沪深/沪科创/北交所' },
    { name: '沪深/创业' },
    { name: '沪深' },
    { name: '标普500', aHead: 'mi' },
    { name: '美股', aHead: 'mi' },
    { name: '沪深300' },
    { name: '中证500' },
];

interface SortGroup {
    caption: string;
    proc: string;
    sorts: Sort[];
}

export const sortGroups: SortGroup[] = [
    {
        caption: '米息价值',
        proc: 'q_incrate_mirate',
        sorts,
    },
    {
        caption: '米息小盘优选',
        proc: 'q_incrate_mirate_s2',
        sorts,
    },
    {
        caption: '毛息小盘',
        proc: 'q_grossrate_spx',
        sorts: [{ name: '标普500', aHead: 'mi' },]
    },
];

export function PageSort() {
    const { group: groupStr } = useParams();
    const uqApp = useUqApp();
    const [data, setData] = useState<any[][]>(undefined);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const [sortI, sortGroup, sort] = parseGroupStr(groupStr);
    if (sortI === undefined) {
        return <Page header="error">
            {groupStr}
        </Page>;
    }
    /*
    let proc: string;
    if (group > 200) {
        group -= 200;
        proc = `q_grossrate_spx`;
    }
    else if (group > 100) {
        group -= 100;
        proc = `q_incrate_mirate_s2`;
    }
    else {
        proc = `q_incrate_mirate`;
    }

    let sort = sorts[group - 1];
    */

    // let mrMin: number, mrMax: number, mrAhead: '增'|'米';
    let { min: mrMin, max: mrMax } = sortValues.getSort(sortI);

    // loadDefault();
    const loadSort = useCallback(async function (min: number, max: number) {
        setData(undefined);
        let ret = await uqApp.miNet.q_incrate_mirate(sortGroup.proc, sortI, min, max);
        function sortIndex(items: any[]) {
            let { length } = items;
            if (length > maxCount) length = maxCount;
            let arr: any[] = [];
            for (let i = 0; i < length; i++) {
                let item = items[i];
                item.i = i;
                arr.push(item);
            }
            return arr;
        }
        setData([
            sortIndex(ret[0]),
            sortIndex(ret[1]),
        ]);
    }, [mrMin, mrMax]);
    useEffectOnce(() => {
        loadSort(mrMin, mrMax);
    });
    if (data === undefined) {
        return <PageSpinner />;
    }
    function setMinMax(min: number, max: number) {
        if (Number.isNaN(min) === true) mrMin = 0;
        else mrMin = min;
        if (Number.isNaN(max) === true) mrMax = 1000000;
        else mrMax = max;
        sortValues.setSort(sortI, { min, max });
    }
    /*
    function loadDefault() {
        let mr = localStorage.getItem('market-range');
        if (mr !== null) {
            let { min, max } = JSON.parse(mr);
            setMinMax(min, max);
        }
    }
    */
    async function onSubmit(data: any) {
        let { min, max } = data;
        setMinMax(min, max);
        await loadSort(min, max);
    }
    function ListHeader({ children, right }: { children: React.ReactNode; right?: JSX.Element; }) {
        return <div className="d-flex ps-3 pe-2 pt-2 pb-1 align-items-center small border-bottom tonwa-bg-gray-2 ">
            <div className="flex-fill">
                {children}
            </div>
            {right}
        </div>;
    }
    const sample = {
        "id": 22282254, "market": 22282242
        , "no": "000014", "name": "沙河股份", "rawid": 14, "day": 20231111
        , "price": 11.35, "volumn": 24204.6, "incrate": 10.3731, "marketvalue": 27.47
    };
    function Piece({ caption, value, fraction, unit }: { caption: string; value: string | number; unit?: string | JSX.Element; fraction?: number; }) {
        let content = value;
        fraction = fraction ?? 2;
        switch (typeof value) {
            default: break;
            case 'number':
                content = value.toFixed(fraction);
                break;
            case 'undefined': return null;
        }
        return <div className="py-2 w-min-5c ps-1 text-end">
            <span className="small text-secondary bg-white ps-1">{caption}</span>
            <div>{content}{unit}</div>
        </div>

    }
    function Day({ day }: { day: number; }) {
        let y = day / 10000;
        let m = day / 100;
        let year = Math.floor(y);
        let month = Math.floor(m);
        let d = Math.floor(day - month * 100);
        month = month - year * 100;
        return <div className="text-secondary">{year}-{month}-{d}</div>;
    }
    function Unit({ children }: { children: React.ReactNode; }) {
        return <small className="ms-1 text-secondary">{children}</small>;
    }
    function ViewItem({ value }: { value: any }) {
        const { i, id, name, no, day, incrate, mirate, price, volumn, marketvalue } = value;
        return <Link to={pathStockInfo(id)}>
            <div className="d-flex me-2">
                <div className="text-danger small me-1 py-2 w-min-1c text-end">{i + 1}</div>
                <div className="py-2 w-min-4c flex-fill">
                    <div className="text-primary me-3 text-nowrap" style={{ zIndex: -1 }}>
                        {name}
                    </div>
                    <div className="text-info me-3">{no}</div>
                </div>
                <Piece caption="增息率" value={incrate} />
                <Piece caption="米息率" value={mirate} />
                <Piece caption="现价" value={price} />
                <Piece caption="市值" value={marketvalue} fraction={0} unit={<Unit>亿</Unit>} />
            </div>
        </Link>;
        // <Piece caption="成交量" value={volumn} fraction={0} unit={<Unit>万</Unit>} />
    }

    let { name: caption, aHead } = sort;
    let data0 = data[0];
    let data1 = data[1];
    let right: any;
    if (data0.length > 0) {
        right = <Day day={data0[0].day} />;
    }
    let vInc = <>
        <ListHeader right={right}>增息排行</ListHeader>
        <List items={data0} ViewItem={ViewItem} />
    </>;
    let vMi = <>
        <ListHeader right={right}>米息排行</ListHeader>
        <List items={data1} ViewItem={ViewItem} />
    </>;
    let vContent: any;
    if (aHead === 'mi') {
        vContent = <>{vMi}{vInc}</>;
    }
    else {
        vContent = <>{vInc}{vMi}</>;
    }
    return <Page header={`${sortGroup.caption}-${caption}`}>
        <form className="row px-3 py-2 gx-0 align-items-center gap-0" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-auto small me-2">市值</div>
            <div className="col-auto">
                <input className="form-control w-4c text-end" type="number" {...register("min", { value: mrMin, min: 0, maxLength: 6, valueAsNumber: true })} />
            </div>
            <div className="col-auto mx-1">-</div>
            <div className="col-auto">
                <input className="form-control w-6c text-end" type="number" {...register("max", { value: mrMax, min: 0, maxLength: 6, valueAsNumber: true })} />
            </div>
            <div className="col-auto ms-2">
                <button className="btn btn-sm btn-primary" type="submit">提交</button>
            </div>
        </form>
        {vContent}
    </Page>;
}

function parseGroupStr(groupStr: string): [number?, SortGroup?, Sort?] {
    let groupIndex: number, sortIndex: number;
    let ret: [number?, SortGroup?, Sort?] = [];
    if (groupStr === undefined) return ret;
    let parts = groupStr.split('-');
    if (parts.length !== 2) return ret;
    groupIndex = Number(parts[0]);
    sortIndex = Number(parts[1]);
    if (Number.isNaN(groupIndex) === true
        || Number.isNaN(sortIndex) === true
        || groupIndex < 0 || groupIndex >= sortGroups.length
    ) return ret;
    let sortGroup = sortGroups[groupIndex];
    let sort = sortGroup.sorts[sortIndex];
    if (sort === undefined) return ret;
    return [sortIndex, sortGroup, sort];
}


const nameSortLocalStorage = 'sort';
interface SortLocal {
    // ahead: '增'|'米',
    min: number,
    max: number,
}
class SortLocalStorage {
    private readonly sorts: SortLocal[];
    constructor() {
        let ret = localStorage.getItem(nameSortLocalStorage);
        if (ret === null) {
            this.sorts = [];
        }
        else {
            try {
                this.sorts = JSON.parse(ret);
            }
            catch {
                this.sorts = [];
            }
        }
    }
    getSort(sortId: number) {
        let ret = this.sorts[sortId];
        if (!ret) {
            this.sorts[sortId] = ret = { min: 0, max: 1000000 };
            localStorage.setItem(nameSortLocalStorage, JSON.stringify(this.sorts));
        }
        return ret;
    }
    setSort(sortId: number, sort: SortLocal) {
        this.sorts[sortId] = sort;
        localStorage.setItem(nameSortLocalStorage, JSON.stringify(this.sorts));
    }
}
const sortValues = new SortLocalStorage();
