/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { useUqApp } from 'app/MyUqApp';
import { GFunc } from 'app/stores';
import { Chart } from 'react-chartjs-2'
import { useQuery } from 'react-query';
import { Page } from 'tonwa-com';

export function PageMirateAvg() {
    const uqApp = useUqApp();
    const { storeApp } = uqApp;
    const { trackDay } = storeApp.state;
    async function load() {
        let rets = await uqApp.miNet.t_mirateavgquery(trackDay);
        if (!Array.isArray(rets)) {
            return;
        }

        let arr1 = rets[0] as { day: number, avg1: number, avg2: number, avg3: number, close1?: number, close300?: number, close399001?: number, close399006?: number }[];
        let arr2 = rets[1] as { mirate: number }[];
        if (trackDay === null && arr2 !== undefined && arr2.length >= 40) {
            let lastDay: number = undefined;
            if (arr1.length > 0) {
                lastDay = arr1[0].day;
            }
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let dt = date.getDate();
            let day = year * 10000 + month * 100 + dt;
            if (day > lastDay) {
                let ni: { day: number, avg1: number, avg2: number, avg3: number } = { day: day, avg1: undefined, avg2: undefined, avg3: undefined };
                let len = arr2.length;
                let getavg = (b: number, l: number): number => {
                    let sum = 0;
                    let e = b + l;
                    if (e > len) return undefined;
                    for (let i = b; i < e; i++) {
                        sum += arr2[i].mirate;
                    }
                    return sum / l;
                }
                ni.avg1 = getavg(0, 40);
                ni.avg2 = getavg(40, 40);
                ni.avg3 = getavg(80, 40);
                arr1.unshift(ni);
            }
        }
        return arr1.reverse();
    }

    let { data: mirates } = useQuery(['mirates'], load);
    let len = mirates.length;
    if (len <= 0)
        return <></>;
    let label = [];
    let y1: number[] = [];
    let y2: number[] = [];
    let y3: number[] = [];
    let close1: number[] = [];
    let close300: number[] = [];
    let close399001: number[] = [];
    let close399006: number[] = [];

    for (let i = 0; i < len; ++i) {
        let item = mirates[i];
        label.push(item.day);
        y1.push(GFunc.numberToPrecision(item.avg1));
        y2.push(GFunc.numberToPrecision(item.avg2));
        y3.push(GFunc.numberToPrecision(item.avg3));
        close1.push(GFunc.numberToPrecision(item.close1, 2));
        close300.push(GFunc.numberToPrecision(item.close300, 2));
        close399001.push(GFunc.numberToPrecision(item.close399001, 2));
        close399006.push(GFunc.numberToPrecision(item.close399006, 2));
    }

    let chartdataFullSH = {
        labels: label,
        datasets: [
            {
                label: '1-40',
                data: y1,
                borderColor: 'red',
                backgroundColor: 'skyBlue',
                pointStyle: "crossRot",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                yAxisID: 'y-axis-1',
            } as any,
            {
                label: '41-80',
                data: y2,
                borderColor: 'blue',
                backgroundColor: 'skyBlue',
                pointStyle: "crossRot",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                yAxisID: 'y-axis-1',
            } as any,
            {
                label: '81-120',
                data: y3,
                borderColor: 'black',
                backgroundColor: 'skyBlue',
                pointStyle: "crossRot",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                yAxisID: 'y-axis-1',
            } as any,
            {
                label: '上证指数',
                data: close1,
                borderColor: 'Magenta',
                backgroundColor: 'skyBlue',
                pointStyle: "crossRot",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                yAxisID: 'y-axis-2',
            } as any,
        ]
    };
    let chartdataFullSZ = {
        labels: label,
        datasets: [
            {
                label: '1-40',
                data: y1,
                borderColor: 'red',
                backgroundColor: 'skyBlue',
                pointStyle: "crossRot",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                yAxisID: 'y-axis-1',
            } as any,
            {
                label: '41-80',
                data: y2,
                borderColor: 'blue',
                backgroundColor: 'skyBlue',
                pointStyle: "crossRot",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                yAxisID: 'y-axis-1',
            } as any,
            {
                label: '81-120',
                data: y3,
                borderColor: 'black',
                backgroundColor: 'skyBlue',
                pointStyle: "crossRot",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                yAxisID: 'y-axis-1',
            } as any,
            {
                label: '深证成指',
                data: close399001,
                borderColor: 'Magenta',
                backgroundColor: 'skyBlue',
                pointStyle: "crossRot",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                yAxisID: 'y-axis-2',
            } as any,
        ]
    };
    let chartdataFull300 = {
        labels: label,
        datasets: [
            {
                label: '1-40',
                data: y1,
                borderColor: 'red',
                backgroundColor: 'skyBlue',
                pointStyle: "crossRot",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                yAxisID: 'y-axis-1',
            } as any,
            {
                label: '41-80',
                data: y2,
                borderColor: 'blue',
                backgroundColor: 'skyBlue',
                pointStyle: "crossRot",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                yAxisID: 'y-axis-1',
            } as any,
            {
                label: '81-120',
                data: y3,
                borderColor: 'black',
                backgroundColor: 'skyBlue',
                pointStyle: "crossRot",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                yAxisID: 'y-axis-1',
            } as any,
            {
                label: '沪深300',
                data: close300,
                borderColor: 'Magenta',
                backgroundColor: 'skyBlue',
                pointStyle: "crossRot",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                yAxisID: 'y-axis-2',
            } as any,
        ]
    };
    let chartdataFullCY = {
        labels: label,
        datasets: [
            {
                label: '1-40',
                data: y1,
                borderColor: 'red',
                backgroundColor: 'skyBlue',
                pointStyle: "crossRot",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                yAxisID: 'y-axis-1',
            } as any,
            {
                label: '41-80',
                data: y2,
                borderColor: 'blue',
                backgroundColor: 'skyBlue',
                pointStyle: "crossRot",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                yAxisID: 'y-axis-1',
            } as any,
            {
                label: '81-120',
                data: y3,
                borderColor: 'black',
                backgroundColor: 'skyBlue',
                pointStyle: "crossRot",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                yAxisID: 'y-axis-1',
            } as any,
            {
                label: '创业板指',
                data: close399006,
                borderColor: 'Magenta',
                backgroundColor: 'skyBlue',
                pointStyle: "crossRot",
                borderWidth: 1,
                pointRadius: 1,
                fill: false,
                yAxisID: 'y-axis-2',
            } as any,
        ]
    };
    let options = {
        scales: {
            yAxes: [{
                type: 'linear',
                display: true,
                position: 'right',
                id: 'y-axis-1',
            },
            {
                type: 'linear',
                display: true,
                position: 'left',
                id: 'y-axis-2',
                gridLines: {
                    drawOnChartArea: false
                }
            },
            ],
        }
    }

    return <Page header={'A股历史米息率'}
        headerClassName='bg-primary'>
        <Chart data={chartdataFullSH} type='line' options={options as any} />
        <Chart data={chartdataFullSZ} type='line' options={options as any} />
        <Chart data={chartdataFull300} type='line' options={options as any} />
        <Chart data={chartdataFullCY} type='line' options={options as any} />
    </Page>;
}
