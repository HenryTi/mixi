import { useAtomValue } from 'jotai';
import { Chart } from 'react-chartjs-2';
import { useOutletContext } from 'react-router-dom';
import { StoreStockInfo, GFunc } from "../../stores";

export function ViewMivaluesChart() {
    const storeStockInfo = useOutletContext<StoreStockInfo>();
    const baseItem = useAtomValue(storeStockInfo.baseItem);
    if (!baseItem) return <></>;
    const { mivalues } = storeStockInfo;
    let len = mivalues.length;
    if (len <= 0)
        return <></>;
    let label = [];
    let y: number[] = [];
    for (let i = 0; i < len; ++i) {
        let item = mivalues[i];
        if (item.season === undefined)
            continue;
        label.push(GFunc.SeasonnoToYearMonth(item.season));
        y.push(item.mivalue);
    }

    let chartdataFull = {
        labels: label,
        datasets: [
            {
                label: '米息',
                data: y.map(v => GFunc.numberToPrecision(v)),
                borderColor: 'black',
                backgroundColor: 'skyBlue',
                pointStyle: "crossRot",
                borderWidth: 1,
                pointRadius: 5,
                lineTension: 0.4,
                fill: false,
            } as any
        ]
    };
    return <Chart data={chartdataFull} type='line' />;
}
