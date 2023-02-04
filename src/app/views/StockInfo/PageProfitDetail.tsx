import { Chart } from 'react-chartjs-2'
import { useOutletContext } from 'react-router-dom';
import { List, Page } from 'tonwa-com';
import { StoreStockInfo, GFunc } from '../../stores';

export function PageProfitDetail() {
    const storeStockInfo = useOutletContext<StoreStockInfo>();
    const { baseItem, seasonData } = storeStockInfo;
    const { name, code, day } = baseItem;

    let headStr = name + ' ' + code;
    if (day !== undefined) {
        headStr += ' - ' + day;
    }
    let head = <div >{headStr}</div>
    return <Page header={head}
        headerClassName='bg-primary'>
        <SeasonEarning />
    </Page>;

    function SeasonEarning() {
        let items = seasonData;
        //let items:any[] = [];
        function ItemView({ value }: { value: { season: number, revenue: number, profit: number, netprofit: number, shares: number, c: number, corg: number } }) {
            let { season, revenue, profit, netprofit, shares } = value;
            let ym = GFunc.SeasonnoToYearMonth(season);
            let a = 0;
            return <div className="px-3 py-2 d-flex flex-wrap">
                <div className="px-3 c8">{ym.toString()}</div>
                <div className="px-3 c8 text-end">{GFunc.numberToFixString(shares, 0)}</div>
                <div className="px-3 c8 text-end">{GFunc.numberToFixString(revenue, 0)}</div>
                <div className="px-3 c8 text-end">{GFunc.numberToFixString(profit, 0)}</div>
                <div className="px-3 c8 text-end">{GFunc.numberToFixString(netprofit, 0)}</div>
            </div>
        }
        return <>
            <PredictChartFullInfo />
            <div className="px-3 py-1">历年利润表</div>
            <div className="px-3">
                <div className="px-3 c8">年月</div>
                <div className="px-3 c8 text-end">股本</div>
                <div className="px-3 c8 text-end">营业收入</div>
                <div className="px-3 c8 text-end">营业利润</div>
                <div className="px-3 c8 text-end">净利润</div>
            </div>
            <List items={items} ItemView={ItemView} />
        </>
    }

    function PredictChartFullInfo() {
        let { predictSeasonDataFull } = storeStockInfo;
        let len = predictSeasonDataFull === undefined ? 0 : predictSeasonDataFull.length;
        if (len <= 0)
            return <></>;
        let label = [];
        let label3 = []
        let netprofit: number[] = [];
        let profit: number[] = [];
        let revenue: number[] = [];

        for (let i = len - 1; i >= 0; --i) {
            let item = predictSeasonDataFull[i];
            if (item.netprofit === undefined)
                continue;
            let l = GFunc.SeasonnoToYearMonth(item.season);
            label.push(l);
            if (i < len - 1) {
                label3.push(l);
            }
            netprofit.push(item.netprofit);
            profit.push(item.profit);
            revenue.push(item.revenue);
        }

        let zzFunc = (e: number[]) => {
            let len = e.length;
            let r: number[] = [];
            let eb = e[0];
            for (let ei = 1; ei < len; ++ei) {
                let eEnd = e[ei];
                let ed = eEnd - eb;
                let eav = (eEnd + eb) / 2;
                if (eav > 0.0001) {
                    r.push(ed * 100 / eav);
                }
                else {
                    r.push(undefined);
                }
                eb = eEnd;
            }
            return r;
        }

        let npZZ = zzFunc(netprofit);
        let pZZ = zzFunc(profit);
        let rZZ = zzFunc(revenue);

        let chartdataFull = {
            labels: label3,
            datasets: [
                {
                    label: '净利润',
                    data: npZZ.map(v => GFunc.numberToPrecision(v)),
                    borderColor: 'black',
                    backgroundColor: 'skyBlue',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 5,
                    fill: false,
                } as any
            ]
        };
        chartdataFull.datasets.push(
            {
                label: '营业利润',
                data: pZZ.map(v => GFunc.numberToPrecision(v)),
                borderColor: 'red',
                backgroundColor: 'pink',
                borderWidth: 1,
                fill: false,
            });
        chartdataFull.datasets.push(
            {
                label: '营业收入',
                data: rZZ.map(v => GFunc.numberToPrecision(v)),
                borderColor: 'blue',
                backgroundColor: 'skyBlue',
                borderWidth: 1,
                fill: false,
            });


        let chartdataProfit = {
            labels: label,
            datasets: [
                {
                    label: '净利润',
                    data: netprofit.map(v => GFunc.numberToPrecision(v)),
                    borderColor: 'black',
                    backgroundColor: 'skyBlue',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 5,
                    fill: false,
                } as any
            ]
        };

        chartdataProfit.datasets.push(
            {
                label: '营业利润',
                data: profit,
                borderColor: 'red',
                backgroundColor: 'pink',
                borderWidth: 1,
                fill: false,
            });

        let chartdataRevenue = {
            labels: label,
            datasets: [
                {
                    label: '营业收入',
                    data: revenue,
                    borderColor: 'blue',
                    backgroundColor: 'skyBlue',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 5,
                    fill: false,
                } as any
            ]
        };

        return <>
            <Chart data={chartdataRevenue} type='line' />
            <Chart data={chartdataFull} type='line' />
            <Chart data={chartdataProfit} type='line' />
        </>;
    };

}