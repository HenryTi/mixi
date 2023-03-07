import { Route } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IDView, Page, useModal } from "tonwa-app";
import { UqAction, UqID, UqQuery } from "tonwa-uq";
import { PartsProps } from "app/template/Parts";
import { UqApp, useUqApp } from "app/UqApp";
import { DetailQPA } from "uqs/JsTicket";
import { PageSheetEdit, PageSheetList, PageSheetNew, SheetParts } from "../../template/Sheet";
import { PageProductSelect, ViewProduct } from "./IDProduct";
import { ChangeEvent, useState } from "react";
import { Band, FormRow, FormRowsView } from "app/coms";
import { FA, LMR } from "tonwa-com";
import { ViewContact } from "./IDContact";

export const purchaseCaption = '采购单';
export const pathPurchase = 'purchase';
// const pathPurchaseNew = 'purchase-new';
// const pathPurchaseEdit = 'purchase-edit';

class SheetPartsPurchase extends SheetParts {
    readonly IDSheet: UqID<any>;
    readonly IDDetail: UqID<any>;
    readonly QueryGetDetails: UqQuery<{ id: number }, { ret: any[] }>;
    readonly ActBookSheet: UqAction<any, any>;
    readonly QuerySearchSheetItem: UqQuery<any, any>;

    readonly caption: string;

    PageDetailItemSelect: (props: { onItemClick: (item: any) => Promise<void>; }) => JSX.Element;
    readonly pathSheet: string;
    readonly PageSheetEdit: (props: { id: number; }) => JSX.Element;
    readonly PageSheetNew: () => JSX.Element;
    readonly PageSheetDetail: <T extends DetailQPA>(props: PartsProps<SheetParts> & { detail: Partial<T>; }) => JSX.Element;
    readonly ViewNO: (props: { no: string }) => JSX.Element;
    readonly ViewTarget: (props: { target: number }) => JSX.Element;
    readonly ViewItemSheet: ({ value }: { value: any }) => JSX.Element;

    constructor(uqApp: UqApp) {
        super(uqApp);
        const { JsTicket: uq } = uqApp.uqs;
        this.IDSheet = uq.SheetPurchase;
        this.IDDetail = uq.DetailQPA;
        this.QueryGetDetails = uq.GetDetailQPAs;
        this.ActBookSheet = uq.BookSheetPurchase;
        this.QuerySearchSheetItem = uq.SearchContact;

        this.PageDetailItemSelect = PageProductSelect;
        this.pathSheet = pathPurchase;
        //this.pathSheetEdit = pathPurchaseEdit;
        //this.pathSheetNew = pathPurchaseNew;
        this.caption = purchaseCaption;
        this.PageSheetEdit = PagePurchaseEdit;
        this.PageSheetNew = PagePurchaseNew;
        this.PageSheetDetail = PageSheetDetail;
        this.ViewItemSheet = ViewItemSheet;

        function ViewItemSheet({ value }: { value: DetailQPA }) {
            let { item, quantity, price, amount } = value;
            return <LMR className="px-3 py-2">
                <IDView uq={uq} id={item} Template={ViewProduct} />
                <div className="align-self-end text-end d-flex align-items-end">
                    <div>
                        <span><small>单价:</small> {price} <small>金额:</small> {amount}</span>
                        <br />
                        <small>数量:</small> <b>{quantity}</b>
                    </div>
                    <FA name="pencil-square-o" className="ms-3 text-info" />
                </div>
            </LMR>;
        }

        this.ViewNO = ViewNO;
        function ViewNO({ no }: { no: string }) {
            return <Band label={'编号'} labelClassName="text-end">
                {no}
            </Band>
        }

        this.ViewTarget = ViewTarget;
        function ViewTarget({ target }: { target: number }) {
            return <Band label={'往来单位'} labelClassName="text-end">
                <IDView id={target} uq={uq} Template={ViewContact} />
            </Band>
        }
    }
}

function PagePurchaseEdit({ id }: { id: number; }) {
    return <PageSheetEdit Parts={SheetPartsPurchase} id={id} />;
}

function PagePurchaseNew() {
    return <PageSheetNew Parts={SheetPartsPurchase} />;
}

function PagePurchaseList() {
    return <PageSheetList Parts={SheetPartsPurchase} />;
}

function PageSheetDetail({ detail, Parts }: (PartsProps<SheetParts> & { detail: Partial<DetailQPA> })) {
    const uqApp = useUqApp();
    const { uq } = uqApp.fromCache(Parts);
    const { quantity, price, amount, item } = detail;
    const { closeModal } = useModal();
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [hasValue, setHasValue] = useState(quantity != undefined);
    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const { value, name } = evt.target;
        let v = Number(value);
        switch (name) {
            case 'quantity': onQuantityChange(v); break;
            case 'price': onPriceChange(v); break;
        }
        setHasValue(!Number.isNaN(v));
    }
    function setAmountValue(amount: number) {
        detail.amount = amount;
        setValue('amount', amount);
        setValue('a', amount);
    }
    function onQuantityChange(value: number) {
        setAmountValue(value * getValues('price'));
    }
    function onPriceChange(value: number) {
        setAmountValue(value * getValues('quantity'));
    }
    const options = { onChange, valueAsNumber: true };
    let formRows: FormRow[] = [
        { name: 'quantity', label: '数量', type: 'number', options: { ...options, value: quantity } },
        { name: 'price', label: '单价', type: 'number', options: { ...options, value: price ?? 1 } },
        { name: 'amount', label: '金额', type: 'number', options: { ...options, value: amount, disabled: true } },
        { type: 'submit', label: hasValue === true ? '提交' : '关闭' },
    ];

    async function onSubmit(data: any) {
        // closeModal(data);
        // amount 字段disabled。setValue('amount'), 改变了input显示，但是取值没有改变。
        // 只能用下面变通
        closeModal({ ...data, amount: detail.amount });
    }
    return <Page header="明细">
        <div className="container">
            <Band label={'产品'} labelClassName="py-2 fw-bold">
                <IDView uq={uq} id={item} Template={ViewProduct} />
            </Band>
        </div>
        <form className="container" onSubmit={handleSubmit(onSubmit)}>
            <FormRowsView rows={formRows} register={register} errors={errors} />
            <input {...register('a', { disabled: true })} type={"number"} />
        </form>
    </Page>;
}

export const routeSheetPurchase = <Route path={pathPurchase} element={<PagePurchaseList />} />;
/*
    <Route path={pathPurchaseNew} element={<PagePurchaseNew />} />
    <Route path={`${pathPurchaseEdit}/:id`} element={<PagePurchaseEdit />} />
    <Route path={pathPurchaseEdit} element={<PagePurchaseEdit />} />
*/
