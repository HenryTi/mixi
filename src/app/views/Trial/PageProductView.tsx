import { useUqApp } from "app/UqApp";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { LabelRowEdit, Page } from "tonwa-app";
import { Sep } from "tonwa-com";

interface RowProps {
    name: string;
    label: string;
    readonly?: boolean;
}

export function PageProductView() {
    const uqApp = useUqApp();
    const { id } = useParams();
    const rows: RowProps[] = [
        { name: 'id', label: 'id', readonly: true },
        { name: 'no', label: '编号', readonly: true },
        { name: 'name', label: '名称' },
    ];
    const { JsTicket } = uqApp.uqs;
    const { data } = useQuery('PageProductView', async () => {
        let ret = await JsTicket.ID({ IDX: JsTicket.Product, id: Number(id) });
        return ret[0] ?? {};
    }, {
        refetchOnWindowFocus: false,
        cacheTime: 0,
    });
    function Row({ label, name, readonly }: RowProps) {
        let value = data[name];
        console.log(`prop value ${name}`, value);
        async function onValueChanged(value: string | number) {
            await JsTicket.ActIDProp(JsTicket.Product, Number(id), name, value);
        }
        return <>
            <LabelRowEdit label={label} value={value} readonly={readonly} onValueChanged={onValueChanged} />
            <Sep />
        </>
    }
    return <Page header="产品">
        {rows.map((v, index) => <Row key={index} {...v} />)}
    </Page>;
}
