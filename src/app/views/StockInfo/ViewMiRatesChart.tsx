import { Chart } from 'react-chartjs-2';
import { usePageStore } from 'tonwa-uq-com';
import { StoreStockInfo, GFunc } from "../../stores";

export function ViewMiRatesChart() {
    const { mirates } = usePageStore<StoreStockInfo>();
    let len = mirates.length;
    if (len <= 0) return <></>;
    let labels = [];
    let y: number[] = [];
    let priceList: number[] = [];
    let priceOrg: number[] = [];
    let price60: number[] = [];
    let price20: number[] = [];
    let sum20: number = 0;
    let sum60: number = 0;
    for (let i = 0; i < len; ++i) {
        let item = mirates[i];
        if (item.day === undefined)
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
        y.push(GFunc.numberToPrecision(item.mirate));
        priceList.push(GFunc.numberToPrecision(item.price));
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
            yAxisID: 'y-axis-1',
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
            yAxisID: 'y-axis-1',
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
            yAxisID: 'y-axis-1',
        },
        {
            label: '米息率',
            data: y,
            borderColor: 'magenta',
            backgroundColor: 'skyBlue',
            pointStyle: "crossRot",
            borderWidth: 3,
            pointRadius: 1,
            fill: false,
            yAxisID: 'y-axis-2',
        }
    ];
    const yAxes = [
        {
            type: 'linear',
            display: true,
            position: 'left',
            id: 'y-axis-1',
        },
        {
            type: 'linear',
            display: true,
            position: 'right',
            id: 'y-axis-2',
            gridLines: {
                drawOnChartArea: false
            }
        }
    ];
    const chartdataFull = { labels, datasets, };
    const options: any = { scales: { yAxes, } }

    return <Chart type='line' data={chartdataFull} options={options} />;
}
