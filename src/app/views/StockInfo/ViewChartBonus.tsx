import { Chart } from 'react-chartjs-2';
import { useOutletContext } from 'react-router-dom';
import { StoreStockInfo, GFunc, SlrForEarning } from "../../stores";

export function ViewChartBonus() {
    const storeStockInfo = useOutletContext<StoreStockInfo>();
    let { predictBonusData, dividents } = storeStockInfo;
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
                    lineTension: 0.3,
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
                    lineTension: 0.3,
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
        let len = predictBonusData.length;
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
                    lineTension: 0.3,
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
}
