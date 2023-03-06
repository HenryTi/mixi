import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useAtom } from "jotai";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { FA, LMR } from "tonwa-com";
import { ItemViewStock } from "../Find";

type SearchOrder = 'miRateDesc' | 'miRateAsc' | 'dvRateDesc' | 'dvRateAsc' | 'roeDesc' | 'roeAsc';
const cnStar = 'small border rounded py-1 px-2 me-3 ';

export function PageSearch() {
    const { storeApp, uqs } = useUqApp();
    const { state: { header, searchKey, markets } } = useLocation();
    const tickReload = useRef(1);
    let [smooth, setSmooth] = useAtom(storeApp.smooth);
    function changeSmooth(v: number) {
        ++tickReload.current;
        setSmooth(v);
        storeApp.setSmooth(v);
    }
    function ViewStars() {
        let stars: number[] = [];
        for (let i = 0; i < 5; i++) stars[i] = 4 - i;
        return <LMR className="p-2">
            <div className="d-flex py-1">
                {
                    stars.map(v => {
                        let cn: string, icon: string;
                        if (v === smooth) {
                            icon = 'star';
                            cn = cnStar + ' text-warning border-primary bg-white';
                        }
                        else if (v < smooth) {
                            cn = cnStar + ' cursor-pointer text-muted ';
                            icon = 'star-o';
                        }
                        else {
                            cn = cnStar + ' cursor-pointer text-warning bg-white';
                            icon = 'star';
                        }
                        return <div key={v} className={cn} onClick={() => changeSmooth(v)}>
                            {v === 0 ? '全部' : <>{v}<FA name={icon} /></>}
                        </div>
                    })
                }
            </div>
            <div className="text-muted small py-1 ml-auto align-self-center">
                <FA name="star-o" /> 近五年分红增长持续度
            </div>
        </LMR>;
    }
    let searchOrder: SearchOrder = 'miRateDesc';
    let searchParam = {
        key: searchKey,
        market: markets?.join('\n'),
        $orderSwitch: searchOrder,
        smooth: (searchKey ? 0 : smooth) + 1,
    };
    return <PageQueryMore header={header ?? '搜索'}
        query={uqs.BrMi.SearchStock}
        param={searchParam}
        sortField="$order"
        ViewItem={ItemViewStock}
        tickReload={tickReload.current}
    >
        <ViewStars />
    </PageQueryMore>
}
