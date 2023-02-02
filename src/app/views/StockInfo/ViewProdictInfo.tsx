import { Chart } from 'react-chartjs-2';
import { useOutletContext } from 'react-router-dom';
import { StoreStockInfo, GFunc, ErForEarning, SlrForEarning } from "../../stores";

export function ViewPredictInfo() {
    const storeStockInfo = useOutletContext<StoreStockInfo>();
    let { predictData, ypredict } = storeStockInfo;
    if (predictData === undefined)
        return <></>;
    let { e, b, r2, epre, l, lr2, lpre } = predictData;
    let chart1 = <></>;
    if (ypredict.length === 5) {
        let er = new ErForEarning(ypredict);
        let chartdata1 = {
            labels: ['0', '1', '2', '3', '4'],
            datasets: [
                {
                    label: '收益原值',
                    data: ypredict.map(v => GFunc.numberToPrecision(v)),
                    borderColor: 'black',
                    backgroundColor: 'skyBlue',
                    pointStyle: "crossRot",
                    borderWidth: 1,
                    pointRadius: 5,
                    fill: false,
                } as any
            ]
        };
        if (!(isNaN(er.B) || isNaN(er.A))) {
            let per: number[] = [];
            for (let i = 0; i < 5; ++i) {
                per.push(GFunc.numberToPrecision(er.predict(i), 4));
            }
            chartdata1.datasets.push(
                {
                    label: '指数回归',
                    data: per,
                    borderColor: 'red',
                    backgroundColor: 'pink',
                    borderWidth: 1,
                    fill: false,
                });
        }
        let lr = new SlrForEarning(ypredict);
        if (!(isNaN(lr.slope) || isNaN(lr.intercept))) {
            let plr: number[] = [];
            for (let i = 0; i < 5; ++i) {
                plr.push(GFunc.numberToPrecision(lr.predict(i), 4));
            }
            chartdata1.datasets.push(
                {
                    label: '线性回归',
                    data: plr,
                    borderColor: 'blue',
                    backgroundColor: 'pink',
                    borderWidth: 1,
                    fill: false,
                });
        }
        chart1 = <Chart data={chartdata1} type='line' />;
    }
    return <>
        <div className="d-flex">
            <div className="d-flex">
                <div className="px-3 py-2 bg-white">指数回归预测</div>
                <div className="d-flex flex-wrap align-items-center">
                    <div className="px-3 c12">{GFunc.caption('e')}{GFunc.numberToString(e, 4)}</div>
                    <div className="px-3 c12">{GFunc.caption('指数b')}{GFunc.numberToString(b, 4)}</div>
                    <div className="px-3 c12">{GFunc.caption('r2')}{GFunc.numberToString(r2, 4)}</div>
                    <div className="px-3 c12">{GFunc.caption('e预测')}{GFunc.numberToString(epre)}</div>
                </div>
            </div>
            <div className="d-flex">
                <div className="px-3 py-2 bg-white">线性回归预测</div>
                <div className="d-flex flex-wrap align-items-center">
                    <div className="px-3 c12">{GFunc.caption('e')}{GFunc.numberToString(e, 4)}</div>
                    <div className="px-3 c12">{GFunc.caption('增长率')}{GFunc.numberToString(l, 4)}</div>
                    <div className="px-3 c12">{GFunc.caption('r2')}{GFunc.numberToString(lr2, 4)}</div>
                    <div className="px-3 c12">{GFunc.caption('e预测')}{GFunc.numberToString(lpre)}</div>
                </div>
            </div>
        </div>
        <div className="col">{chart1}</div>
    </>;
}
