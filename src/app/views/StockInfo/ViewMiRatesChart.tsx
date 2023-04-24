import { useAtomValue } from 'jotai';
import { Chart } from 'react-chartjs-2';
import { useOutletContext } from 'react-router-dom';
import { StoreStockInfo, GFunc } from "../../stores";

export function ViewMiRatesChart() {
    const storeStockInfo = useOutletContext<StoreStockInfo>();
    const { mirates } = storeStockInfo;
    const baseItem = useAtomValue(storeStockInfo.baseItem);
    if (!baseItem) return <></>;
    let len = mirates.length;
    if (len <= 0) return <></>;
    let labels = [];
    let y: number[] = [];
    let yrates: number[] = [];
    let priceList: number[] = [];
    let priceOrg: number[] = [];
    let price60: number[] = [];
    let price20: number[] = [];
    let sum20: number = 0;
    let sum60: number = 0;
    let pmmax: number = 20;
    let mirateMax: number = 20;
    for (let i = 0; i < len; ++i) {
        let item = mirates[i];
        if (item.day === undefined || item.price === undefined)
            continue;
        labels.push(item.day);
        priceOrg.push(item.price);
        sum20 += item.price;
        sum60 += item.price;
        if (priceOrg.length >= 20) {
            price20.push(GFunc.numberToPrecision(sum20 / 20));
            sum20 -= priceOrg[priceOrg.length - 20];
        }
        else {
            price20.push(undefined);
        }
        if (priceOrg.length >= 60) {
            price60.push(GFunc.numberToPrecision(sum60 / 60));
            sum60 -= priceOrg[priceOrg.length - 60];
        }
        else {
            price60.push(undefined);
        }
        let { mirate } = item;
        if (mirate !== undefined && mirate !== null) {
            mirateMax = Math.max(mirateMax, mirate);
        }
        let pm = mirate !== undefined && mirate !== null && mirate > 0 ? 100 / mirate : undefined;
        if (pm !== undefined) {
            pmmax = Math.max(pmmax, pm);
        }
        y.push(GFunc.numberToPrecision(pm));
        yrates.push(GFunc.numberToPrecision(mirate));
        priceList.push(GFunc.numberToPrecision(item.price));
    }
    let ymax = pmmax > 20 ? pmmax + 0.1 : 20;
    if (ymax > 55) {
        ymax = 60;
    }
    if (mirateMax > 20) {
        mirateMax = mirateMax + 0.1;
    }
    if (mirateMax > 55) {
        mirateMax = 60;
    }

    const datasets = [
        {
            label: '价格',
            data: priceList,
            borderColor: 'navy',
            backgroundColor: 'pink',
            pointStyle: "crossRot",
            borderWidth: 1,
            pointRadius: 1,
            fill: false,
            yAxisID: 'y1',
        },
        {
            label: 'MA20',
            data: price20,
            borderColor: 'violet',
            backgroundColor: 'pink',
            pointStyle: "crossRot",
            borderWidth: 1,
            pointRadius: 1,
            fill: false,
            lineTension: 0.3,
            yAxisID: 'y1',
        },
        {
            label: 'MA60',
            data: price60,
            borderColor: 'limegreen',
            backgroundColor: 'pink',
            pointStyle: "crossRot",
            borderWidth: 1,
            pointRadius: 1,
            fill: false,
            lineTension: 0.3,
            yAxisID: 'y1',
        },
        {
            label: 'PM',
            data: y,
            borderColor: 'magenta',
            backgroundColor: 'skyBlue',
            pointStyle: "crossRot",
            borderWidth: 3,
            pointRadius: 1,
            fill: false,
            lineTension: 0.3,
            yAxisID: 'y2',
        }
    ];
    const chartdataFull = { labels, datasets, };
    const datasetsRate = [
        {
            label: '价格',
            data: priceList,
            borderColor: 'navy',
            backgroundColor: 'pink',
            pointStyle: "crossRot",
            borderWidth: 1,
            pointRadius: 1,
            fill: false,
            yAxisID: 'y1',
        },
        {
            label: 'MA20',
            data: price20,
            borderColor: 'violet',
            backgroundColor: 'pink',
            pointStyle: "crossRot",
            borderWidth: 1,
            pointRadius: 1,
            fill: false,
            lineTension: 0.3,
            yAxisID: 'y1',
        },
        {
            label: 'MA60',
            data: price60,
            borderColor: 'limegreen',
            backgroundColor: 'pink',
            pointStyle: "crossRot",
            borderWidth: 1,
            pointRadius: 1,
            fill: false,
            lineTension: 0.3,
            yAxisID: 'y1',
        },
        {
            label: '米息率',
            data: yrates,
            borderColor: 'magenta',
            backgroundColor: 'skyBlue',
            pointStyle: "crossRot",
            borderWidth: 3,
            pointRadius: 1,
            fill: false,
            lineTension: 0.3,
            yAxisID: 'y2',
        }
    ];
    const chartdataFullRate = { labels, datasets: datasetsRate, };
    const options: any = {
        scales: {
            y1: {
                type: 'linear',
                display: true,
                position: 'left',
            },
            y2: {
                type: 'linear',
                display: true,
                position: 'right',
                min: 0,
                max: ymax,
                grid: {
                    drawOnChartArea: false
                }
            }
        }
    }
    const optionsRate: any = {
        scales: {
            y1: {
                type: 'linear',
                display: true,
                position: 'left',
            },
            y2: {
                type: 'linear',
                display: true,
                position: 'right',
                min: 0,
                max: mirateMax,
                grid: {
                    drawOnChartArea: false
                }
            }
        }
    }

    return <>
        <Chart type='line' data={chartdataFull} options={options} />
        <Chart type='line' data={chartdataFullRate} options={optionsRate} />
    </>;
}
