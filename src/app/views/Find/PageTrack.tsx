import { FormRow, FormRowsView } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useAtomValue, useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Page } from "tonwa-com";
import { LinkMiRateAvg, trackCaption } from "./Links";
import { pathSetTrackDay } from "./routeFind";
import { ViewFindStock } from "./ViewFindStock";

function numberToDate(value: number) {
    let day = value % 100;
    let month = (value / 100) % 100;
    let year = Math.floor(value / 10000);
    let date = new Date(year, month - 1, day);
    return date;
}

export function PageTrack() {
    let { storeApp } = useUqApp();
    const trackDay = useAtomValue(storeApp.trackDay);
    let date = numberToDate(trackDay);
    return <Page header={trackCaption}>
        <div className="p-3">
            历史数据起始日: {date.toDateString()}
        </div>

        <div className="d-flex flex-wrap bg-white p-2 my-2">
            <LinkMiRateAvg />
        </div>
        <ViewFindStock />
    </Page>;
}

export function PageSetTrackDay() {
    const navigate = useNavigate();
    const { storeApp } = useUqApp();
    const { trackDay: atomTrackDay } = storeApp;
    const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onBlur' });
    const setTrackDay = useSetAtom(atomTrackDay);
    async function onSubmit(data: any) {
        setTrackDay(data['value']);
        navigate(pathSetTrackDay, { replace: true });
    }
    function checkDate(value: number) {
        let date = numberToDate(value);
        if (date < new Date(2005, 1, 1)) {
            return '历史日期不能早于2005-01-01';
        }
        return true;
    }
    const formRows: FormRow[] = [
        { name: 'value', label: '分析开始日', type: 'number', placeHolder: 'yyMMDD', options: { validate: checkDate } },
        { type: 'submit' },
    ];
    return <Page header={trackCaption}>
        <form onSubmit={handleSubmit(onSubmit)} className="container my-3">
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </Page>;
}
