import { useForm } from "react-hook-form";
import { Page } from "tonwa-app";
import { FormRowsView, FormRow } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

export function PageProductNew() {
    const uqApp = useUqApp();
    const navigate = useNavigate();
    const { JsTicket } = uqApp.uqs;
    const { data: retNo } = useQuery('PageNewProduct', async () => {
        console.log('queryNo');
        let retNo = await JsTicket.IDNO({ ID: JsTicket.Product });
        console.log('retNo', retNo);
        return retNo;
    }, { cacheTime: 0, refetchOnWindowFocus: false });
    console.log('after useQuery retNo', retNo);
    const formRows: FormRow[] = [
        { name: 'no', label: '编号', type: 'text', options: { maxLength: 20, value: retNo, disabled: true } },
        { name: 'name', label: '名称', type: 'text', options: { maxLength: 50 } },
        { type: 'submit' },
    ];
    const { register, handleSubmit, formState: { errors }, } = useForm({ mode: 'onBlur' });
    async function onSubmit(data: any) {
        alert(JSON.stringify(data));
        data.no = retNo;
        const { no, name } = data;
        let ret = await JsTicket.SaveProduct.submit({ pNo: no, name });
        alert(JSON.stringify(ret));
        navigate(-1);
    }

    return <Page header="新建产品">
        <form onSubmit={handleSubmit(onSubmit)} className="container my-3">
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </Page>;
}
