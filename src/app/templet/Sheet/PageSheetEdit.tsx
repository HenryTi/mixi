import { FormRow, FormRowsView, PageMoreCacheData } from "app/coms";
import { ChangeEvent, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IDView, Page, useModal } from "tonwa-app";
import { ButtonAsync, FA, getAtomValue, List, LMR, Sep, setAtomValue, useEffectOnce, wait } from "tonwa-com";
// import { PageProductSelect } from "../Product";
import { atom, useAtomValue } from "jotai";
import { Detail, Product, SheetPurchase } from "uqs/JsTicket";
import { SheetParts } from "./SheetParts";

export function PageSheetEdit({ parts }: { parts: SheetParts }) {
    //const { JsTicket } = uqApp.uqs;
    const { uqApp, uq, IDDetail, QueryGetDetails, ActBookSheet, caption, PageDetailItemSelect } = parts;
    const { id } = useParams();
    const navigate = useNavigate();
    const refItemsAtom = useRef(atom([] as any[]));
    const [visible, setVisible] = useState(true);
    const [sheet, setSheet] = useState({} as SheetPurchase);
    const items = useAtomValue(refItemsAtom.current);
    const sheetId = Number(id);
    useEffectOnce(() => {
        (async function () {
            let [sheet, { ret: details }] = await Promise.all([
                uq.idObj(sheetId),
                QueryGetDetails.query({ id: sheetId }),
            ]);
            setSheet(sheet);
            setAtomValue(refItemsAtom.current, details);
        })();
    })
    let btnSubmit: any, cnAdd: string;
    if (items.length === 0) {
        cnAdd = 'btn btn-primary';
    }
    else {
        btnSubmit = <ButtonAsync className="btn btn-primary" onClick={onSubmit}>提交</ButtonAsync>;
        cnAdd = 'btn btn-outline-primary';
    }
    const button = <LMR className="px-3 py-2">
        {btnSubmit}
        {visible === true && <button className={cnAdd} onClick={onAddDetail}>增加明细</button>}
    </LMR>;
    const { openModal, closeModal } = useModal();
    async function onSubmit() {
        setVisible(false);
        await ActBookSheet.submit({ id: sheetId });
        let { pageCache } = uqApp;
        let latestItem = pageCache.getLatestItem<PageMoreCacheData>();
        if (latestItem) {
            let { data } = latestItem;
            if (data) {
                data.removeItem<{ ix: number, xi: number }>(v => v.xi === sheetId) as any;
            }
        }
        function addDetailOnOk() {
            closeModal();
            onAddDetail();
        }
        await openModal(<Page header="提交成功" back="none">
            <div className="p-3">
                {caption} <b>{sheet.no}</b> 已提交
            </div>
            <div className="border-top p-3">
                <button className="btn btn-outline-primary" onClick={closeModal}>返回</button>
                <button className="ms-3 btn btn-outline-secondary" onClick={addDetailOnOk}>新建{caption}</button>
            </div>
        </Page>);
        navigate(-1);
    }
    async function onAddDetail() {
        openModal(<PageDetailItemSelect onItemClick={onItemSelect} />);
    }
    async function onItemSelect(item: any) {
        let itemId = item.id;
        let ret = await openModal(<PageSheetDetail item={item} value={undefined} parts={parts} />);
        let { quantity } = ret;
        if (Number.isNaN(quantity) === false) {
            let id = await uq.ActID({
                ID: IDDetail,
                value: {
                    sheet: sheetId,
                    item: itemId,
                    value: quantity
                }
            })
            let row = { id, item: itemId, quantity };
            const items = getAtomValue(refItemsAtom.current);
            setAtomValue(refItemsAtom.current, [...items, row]);
            closeModal();
            onAddDetail();
        }
        else {
            closeModal();
        }
    }
    function ViewProduct({ value }: { value: Product }) {
        let { no, name } = value;
        return <div>
            <small>{no}</small>
            <div><b>{name}</b></div>
        </div>;
    }
    function ViewItem({ value: rowItem }: { value: any; }) {
        let { item, value } = rowItem;
        return <LMR className="px-3 py-2">
            <IDView uq={uq} id={item} Template={ViewProduct} />
            <div className="align-self-end">
                <span>{value}</span>
                <FA name="pencil-square-o" className="ms-3 text-info" />
            </div>
        </LMR>;
    }
    function ViewVendor({ value }: { value: any; }) {
        return <>{JSON.stringify(value)}</>;
    }
    function None() {
        return <div className="small text-muted px-3 py-3">[ 无明细 ]</div>;
    }
    async function onEditDetail(detail: Detail) {
        let { id, item, value } = detail;
        let { quantity } = await openModal(<PageSheetDetail item={item} value={value} parts={parts} />);
        await uq.ActID({
            ID: IDDetail,
            value: {
                id,
                sheet: sheetId,
                item,
                value: quantity
            }
        })
        const items = getAtomValue(refItemsAtom.current);
        let index = items.findIndex(v => v.id === id);
        items.splice(index, 1, { id, item, value: quantity });
        setAtomValue(refItemsAtom.current, [...items]);
    }
    return <Page header="单据">
        <div className="py-2 tonwa-bg-gray-3">
            <div className="px-3 py-2">
                <b>编号：</b>{sheet.no}
            </div>
            <div className="px-3 py-2">
                <b>往来单位：</b><IDView id={sheet.vendor} uq={uq} Template={ViewVendor} />
            </div>
        </div>
        {items.length > 6 ? <>{button}<Sep /></> : <Sep />}
        <List items={items} ViewItem={ViewItem} none={<None />} onItemClick={onEditDetail} />
        <Sep />
        {button}
    </Page>;
}

function PageSheetDetail({ item, value, parts }: { item: any, value: number, parts: SheetParts }) {
    const { closeModal } = useModal();
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [hasValue, setHasValue] = useState(value != undefined);
    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        let v = Number(evt.target.value);
        setHasValue(!Number.isNaN(v));
    }
    let formRows: FormRow[] = [
        { name: 'quantity', label: '数量', type: 'number', options: { onChange, value, valueAsNumber: true } },
        { type: 'submit', label: hasValue === true ? '提交' : '关闭' },
    ];
    async function onSubmit(data: any) {
        closeModal(data);
    }
    return <Page header="数量">
        <div className="px-3 py-2"><b>产品: </b>{JSON.stringify(item)}</div>
        <form className="container" onSubmit={handleSubmit(onSubmit)}>
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </Page>;
}
