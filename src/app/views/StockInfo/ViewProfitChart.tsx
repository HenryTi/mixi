import { Chart } from 'react-chartjs-2';
import { Link, useOutletContext } from 'react-router-dom';
import { StoreStockInfo, GFunc, SlrForEarning } from "../../stores";
import { pathProfitDetail } from './routeStock';

export function ViewProfitChart() {
    const storeStockInfo = useOutletContext<StoreStockInfo>();
    let { chartFull, chartProfit, chartRevenue } = getProfitCharts();
    let chartRoe = predictChartROE();

    function getProfitCharts() {
        let { predictSeasonDataFull } = storeStockInfo;
        let len = predictSeasonDataFull === undefined ? 0 : predictSeasonDataFull.length;
        if (len <= 0)
            return { chartFull: <></>, chartProfit: <></>, chartRevenue: <></> };

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
                    lineTension: 0.3,
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
                lineTension: 0.3,
                fill: false,
            });
        chartdataFull.datasets.push(
            {
                label: '营业收入',
                data: rZZ.map(v => GFunc.numberToPrecision(v)),
                borderColor: 'blue',
                backgroundColor: 'skyBlue',
                borderWidth: 1,
                lineTension: 0.3,
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
                    lineTension: 0.3,
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
                lineTension: 0.3,
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
                    lineTension: 0.3,
                    fill: false,
                } as any
            ]
        };

        return {
            chartFull: <Chart data={chartdataFull} type='line' />,
            chartProfit: <Chart data={chartdataProfit} type='line' />,
            chartRevenue: <Chart data={chartdataRevenue} type='line' />
        };
    };

    function predictChartROE() {
        let { predictSeasonDataFull } = storeStockInfo;
        let len = predictSeasonDataFull === undefined ? 0 : predictSeasonDataFull.length;
        if (len <= 0)
            return <></>;
        let label = [];
        let y: number[] = [];
        for (let i = len - 1; i >= 0; --i) {
            let item = predictSeasonDataFull[i];
            if (item.netprofit === undefined)
                continue;
            label.push(GFunc.SeasonnoToYearMonth(item.season));
            y.push(item.netprofit / item.shares / item.c);
        }

        let chartdataFull = {
            labels: label,
            datasets: [
                {
                    label: 'ROE原值',
                    data: y.map(v => GFunc.numberToPrecision(v)),
                    borderColor: 'black',
                    backgroundColor: 'skyBlue',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 5,
                    lineTension: 0.3,
                    fill: false,
                } as any
            ]
        };
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
        return <Chart data={chartdataFull} type='line' />;
    };

    return <>
        <Link className="px-3 mt-3 py-2 tonwa-bg-gray-2 border-bottom"
            to={pathProfitDetail}>营收利润&gt;&gt;</Link>
        <div className="row">
            <div className="col">{chartRevenue}</div>
            <div className="col">{chartFull}</div>
        </div>
        <div className="row">
            <div className="col">{chartProfit}</div>
            <div className="col">{chartRoe}</div>
        </div>
    </>
}
