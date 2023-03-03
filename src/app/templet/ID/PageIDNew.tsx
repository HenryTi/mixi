import { useForm } from "react-hook-form";
import { Page } from "tonwa-app";
import { FormRowsView, FormRow } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { UqID } from "tonwa-uq";

interface PageIDNewProps {
    header: string;
    ID: UqID<any>;
    formRows: FormRow[];
    onNo: (no: string) => void;
    actSave: (no: string, data: any) => Promise<any>;
}
export function PageIDNew({ header, ID, formRows, onNo, actSave }: PageIDNewProps) {
    const uqApp = useUqApp();
    const navigate = useNavigate();
    const { JsTicket } = uqApp.uqs;
    const { data: retNo } = useQuery('PageIDNew', async () => {
        console.log('queryNo');
        let retNo = await JsTicket.IDNO({ ID });
        console.log('retNo', retNo);
        return retNo;
    }, { cacheTime: 0, refetchOnWindowFocus: false });
    console.log('after useQuery retNo', retNo);
    onNo(retNo);
    const { register, handleSubmit, formState: { errors }, } = useForm({ mode: 'onBlur' });
    async function onSubmit(data: any) {
        alert(JSON.stringify(data));
        let ret = await actSave(retNo, data);
        /*
        data.no = retNo;
        const { no, name } = data;
        let ret = await JsTicket.SaveProduct.submit({ pNo: no, name });
        */
        alert(JSON.stringify(ret));
        navigate(-1);
    }

    return <Page header={header}>
        <form onSubmit={handleSubmit(onSubmit)} className="container my-3">
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </Page>;
}
