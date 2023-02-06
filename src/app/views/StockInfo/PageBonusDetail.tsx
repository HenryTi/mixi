import { Chart } from 'react-chartjs-2'
import { List } from 'tonwa-com';
import { Page } from 'tonwa-app';
import { StockBonus } from 'app/model/StockInfoType';
import { StoreStockInfo, GFunc, SlrForEarning } from '../../stores';
import { useUqApp } from 'app/UqApp';
import { useOutletContext } from 'react-router-dom';

export function PageBonusDetail() {
    const uqApp = useUqApp();
    const storeStockInfo = useOutletContext<StoreStockInfo>();
    const { baseItem, bonus, dividentOrg } = storeStockInfo;
    let { name, code, day } = baseItem;
    let market = uqApp.storeApp.getMarket(baseItem.stock);
    let marketName = market?.name;
    let symbol = (marketName ?? '') + code;

    let headStr = name + ' ' + code;
    if (day !== undefined) {
        headStr += ' - ' + day;
    }
    return <Page header={headStr}
        headerClassName='bg-primary'>
        <Bonus />
    </Page>;

    function Bonus() {
        if (dividentOrg.length > 0) return <BonusOrg />;
        return <BonusExt />;
    }

    function BonusOrg() {
        let url = `https://xueqiu.com/snowman/S/${symbol}/detail#/FHPS`;
        function ItemView({ value }: { value: { year: number, season: string, divident: number, day: number } }) {
            const { year, season, divident, day } = value;
            return <div className="px-3 py-2 d-flex flex-wrap">
                <div className="px-3 c8">{`${year}${season}`}</div>
                <div className="px-3 c6 text-end"> {divident.toFixed(3)}</div>
                <div className="px-3 c6 text-end"> {day}</div>
            </div>;
        }
        return <>
            <a className="px-3 py-1 btn btn-sm btn-link d-sm-inline d-none" href={url} target="_blank" rel="noreferrer">雪球分红信息</a>
            <ChartBonus />
            <div className="px-3 py-1">历年分红</div>
            <div className="px-3">
                <div className="px-3 c8">报期</div>
                <div className="px-3 c6 text-end">分红</div>
                <div className="px-3 c6 text-end">除权日期</div>
            </div>
            <List items={dividentOrg.slice().reverse()} ItemView={ItemView} />
        </>;
    }

    function BonusExt() {
        function ItemView({ value }: { value: StockBonus }) {
            const { day, bonus } = value;
            return <div className="px-3 py-2 d-flex flex-wrap">
                <div className="px-3 c8">{day}</div>
                <div className="px-3 c6 text-end"> {bonus.toFixed(3)}</div>
            </div>
        }
        return <>
            <ChartBonus />
            <div className="px-3 py-1">历年分红</div>
            <div className="px-3">
                <div className="px-3 c8">日期</div>
                <div className="px-3 c6 text-end">分红</div>
            </div>
            <List items={bonus} ItemView={ItemView} />
        </>
    }

    function ChartBonus() {
        const { predictBonusData, dividents } = storeStockInfo;
        if (dividents !== undefined) {
            let len = dividents.length;
            if (len <= 0)
                return <></>;
            let label = [];
            let y: number[] = [];
            let y3: number[] = [];
            for (let i = 0; i < len; ++i) {
                let item = dividents[i];
                label.push(item.year);
                y.push(GFunc.numberToPrecision(item.divident));
                y3.push(GFunc.numberToPrecision(item.d3));
            }

            let chartdataFull = {
                labels: label,
                datasets: [
                    {
                        label: '每年分红',
                        data: y,
                        borderColor: 'black',
                        backgroundColor: 'skyBlue',
                        pointStyle: "crossRot",
                        borderWidth: 1,
                        pointRadius: 5,
                        fill: false,
                    } as any,
                    {
                        label: '3年均值',
                        data: y3,
                        borderColor: 'magenta',
                        backgroundColor: 'skyBlue',
                        pointStyle: "crossRot",
                        borderWidth: 3,
                        pointRadius: 5,
                        fill: false,
                    } as any
                ]
            };
            if (y.length >= 3) {
                let lr = new SlrForEarning(y);
                if (!(isNaN(lr.slope) || isNaN(lr.intercept))) {
                    let plr: number[] = [];
                    for (let i = 0; i < len; ++i) {
                        plr.push(Number.parseFloat(lr.predict(i).toPrecision(4)));
                    }
                    chartdataFull.datasets.push(
                        {
                            label: '线性 R2:' + GFunc.numberToString(lr.r2, 4),
                            data: plr,
                            borderColor: 'blue',
                            backgroundColor: 'pink',
                            borderWidth: 1,
                            fill: false,
                        });
                }
            }
            return <Chart data={chartdataFull} type='line' />;
        }
        else {
            let len = predictBonusData === undefined ? 0 : predictBonusData.length;
            if (len <= 0)
                return <></>;
            let label = [];
            let y: number[] = [];
            for (let i = 0; i < len; ++i) {
                let item = predictBonusData[i];
                if (item.bonus === undefined)
                    continue;
                label.push(item.year);
                y.push(item.bonus);
            }

            let chartdataFull = {
                labels: label,
                datasets: [
                    {
                        label: '分红原值',
                        data: y.map(v => GFunc.numberToPrecision(v)),
                        borderColor: 'black',
                        backgroundColor: 'skyBlue',
                        pointStyle: "crossRot",
                        borderWidth: 1,
                        pointRadius: 5,
                        fill: false,
                    } as any
                ]
            };
            if (y.length >= 3) {
                let lr = new SlrForEarning(y);
                if (!(isNaN(lr.slope) || isNaN(lr.intercept))) {
                    let plr: number[] = [];
                    for (let i = 0; i < len; ++i) {
                        plr.push(Number.parseFloat(lr.predict(i).toPrecision(4)));
                    }
                    chartdataFull.datasets.push(
                        {
                            label: '线性 R2:' + GFunc.numberToString(lr.r2, 4),
                            data: plr,
                            borderColor: 'blue',
                            backgroundColor: 'pink',
                            borderWidth: 1,
                            fill: false,
                        });
                }
            }
            return <Chart data={chartdataFull} type='line' />;
        }
    };
}
