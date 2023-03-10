import { useForm } from "react-hook-form";
import { Page } from "tonwa-app";
import { FormRowsView, FormRow } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { IDParts } from "./IDParts";
import { PartsProps } from "../Parts";

/*
interface PageIDNewProps {
    header: string;
    ID: UqID<any>;
    formRows: FormRow[];
    onNo: (no: string) => void;
    actSave: (no: string, data: any) => Promise<any>;
}
*/
export function PageIDNew({ Parts }: PartsProps<IDParts>) {
    const uqApp = useUqApp();
    const { caption, ID, formRows, onNo, actSave } = uqApp.fromCache(Parts);
    const navigate = useNavigate();
    const { JsTicket } = uqApp.uqs;
    const { data: retNo } = useQuery('PageIDNew', async () => {
        let retNo = await JsTicket.IDNO({ ID });
        return retNo;
    }, { cacheTime: 0, refetchOnWindowFocus: false });
    onNo(retNo);
    const { register, handleSubmit, formState: { errors }, } = useForm({ mode: 'onBlur' });
    async function onSubmit(data: any) {
        alert(JSON.stringify(data));
        let ret = await actSave(retNo, data);
        alert(JSON.stringify(ret));
        navigate(-1);
    }

    return <Page header={`新建${caption}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="container my-3">
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </Page>;
}
