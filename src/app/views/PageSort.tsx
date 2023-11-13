import { Link, useParams } from "react-router-dom";
import { Page } from "tonwa-app";
import { useQuery } from "react-query";
import { useUqApp } from "app/UqApp";
import { List } from "tonwa-com";
import { pathStockInfo } from "./StockInfo";

export const UseQueryOptions = {
    cacheTime: 100,
    refetchOnWindowFocus: false
};

const maxCount = 40;
export function PageSort() {
    const { group } = useParams();
    const uqApp = useUqApp();
    const { data } = useQuery(['sort', group], async () => {
        let ret = await uqApp.miNet.q_incrate_mirate(Number(group) - 1, 0, 50);
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
        return [
            sortIndex(ret[0]),
            sortIndex(ret[1]),
        ];
    }, UseQueryOptions);
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
    function Unit({ children }: { children: React.ReactNode; }) {
        return <small className="ms-1 text-secondary">{children}</small>;
    }
    function ViewItem({ value }: { value: any }) {
        const { i, id, name, no, incrate, mirate, price, volumn, marketvalue } = value;
        return <Link to={pathStockInfo(id)}>
            <div className="">
                <div className="px-3 d-flex flex-wrap">
                    <div className="pt-2 text-danger small w-2c">{i + 1}</div>

                    <div className="border-end py-2 w-8c">
                        <div className="text-primary me-3">{name}</div>
                        <div className="text-info me-3">{no}</div>
                    </div>
                    <Piece caption="增息率" value={incrate} />
                    <Piece caption="米息率" value={mirate} />
                    <Piece caption="现价" value={price} />
                    <Piece caption="市值" value={marketvalue} fraction={0} unit={<Unit>亿</Unit>} />
                </div>
            </div>
        </Link>;
        // <Piece caption="成交量" value={volumn} fraction={0} unit={<Unit>万</Unit>} />
    }

    return <Page header={group + '组'}>
        <ListHeader>增息排行</ListHeader>
        <List items={data[0]} ViewItem={ViewItem} />
        <ListHeader>米息排行</ListHeader>
        <List items={data[1]} ViewItem={ViewItem} />
    </Page>;
}