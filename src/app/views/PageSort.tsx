import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Page, PageSpinner } from "tonwa-app";
import { useQuery } from "react-query";
import { useUqApp } from "app/UqApp";
import { List, useEffectOnce } from "tonwa-com";
import { pathStockInfo } from "./StockInfo";
import { useCallback, useState } from "react";

export const UseQueryOptions = {
    cacheTime: 100,
    refetchOnWindowFocus: false
};

const maxCount = 40;
export const groupTop: { [group: number]: string; } = {
    [1]: '沪深/沪科创/北交所',
    [2]: '沪深/创业',
    [3]: '沪深',
}

export function PageSort() {
    const { group: groupStr } = useParams();
    const group = Number(groupStr);
    const uqApp = useUqApp();
    const [data, setData] = useState<any[][]>(undefined);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    let mrMin: number, mrMax: number;
    loadDefault();
    const loadSort = useCallback(async function (min: number, max: number) {
        setData(undefined);
        let ret = await uqApp.miNet.q_incrate_mirate(group - 1, min, max);
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
    }
    function loadDefault() {
        let mr = localStorage.getItem('market-range');
        if (mr !== null) {
            let { min, max } = JSON.parse(mr);
            setMinMax(min, max);
        }
    }
    async function onSubmit(data: any) {
        let { min, max } = data;
        localStorage.setItem('market-range', JSON.stringify(data));
        setMinMax(min, max);
        await loadSort(min, max);
    }
    function ListHeader({ children }: { children: React.ReactNode; }) {
        return <div className="pt-2 pb-1 px-3 small border-bottom tonwa-bg-gray-2">
            {children}
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
        return <div className="py-2 w-6c me-3 text-end">
            <div className="small">{caption}</div>
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
        return <div className="py-2 w-6c ms-3 me-3">
            <div className="small text-secondary">日期</div>
            <div className="text-secondary">{year}-{month}-{d}</div>
        </div>
    }
    function Unit({ children }: { children: React.ReactNode; }) {
        return <small className="ms-1 text-secondary">{children}</small>;
    }
    function ViewItem({ value }: { value: any }) {
        const { i, id, name, no, day, incrate, mirate, price, volumn, marketvalue } = value;
        return <Link to={pathStockInfo(id)}>
            <div className="">
                <div className="px-3 d-flex flex-wrap">
                    <div className="pt-2 text-danger small w-2c">{i + 1}</div>

                    <div className="border-end py-2 w-8c">
                        <div className="text-primary me-3">{name}</div>
                        <div className="text-info me-3">{no}</div>
                    </div>
                    <Day day={day} />
                    <Piece caption="增息率" value={incrate} />
                    <Piece caption="米息率" value={mirate} />
                    <Piece caption="现价" value={price} />
                    <Piece caption="市值" value={marketvalue} fraction={0} unit={<Unit>亿</Unit>} />
                </div>
            </div>
        </Link>;
        // <Piece caption="成交量" value={volumn} fraction={0} unit={<Unit>万</Unit>} />
    }

    return <Page header={group + '组: ' + groupTop[group]}>
        <form className="row px-3 py-2 g-3 align-items-center" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-auto">市值</div>
            <div className="col-auto">
                <input className="form-control w-8c" type="number" {...register("min", { value: mrMin, min: 0, maxLength: 6, valueAsNumber: true })} />
            </div>
            <div className="col-auto"> - </div>
            <div className="col-auto">
                <input className="form-control w-8c" type="number" {...register("max", { value: mrMax, min: 0, maxLength: 6, valueAsNumber: true })} />
            </div>
            <div className="col-auto">
                <button className="btn btn-sm btn-primary" type="submit">提交</button>
            </div>
        </form>
        <ListHeader>增息排行</ListHeader>
        <List items={data[0]} ViewItem={ViewItem} />
        <ListHeader>米息排行</ListHeader>
        <List items={data[1]} ViewItem={ViewItem} />
    </Page>;
}
