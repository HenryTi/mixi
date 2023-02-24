import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Page, useModal } from "tonwa-app";
import { FormRowsView, FormRow } from "app/coms";
import { MiAccount } from "app/stores/MiAccount";
import { useAtomValue } from "jotai";

interface FormActProps<T = any> {
    onSubmit: (data: T) => Promise<void>;
    formRows: FormRow[];
}

function FormAct({ onSubmit, formRows }: FormActProps) {
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
    return <form onSubmit={handleSubmit(onSubmit)} className="container my-3">
        <FormRowsView rows={formRows} register={register} errors={errors} />
    </form>
}

export function PageStockBuy() {
    const miAccount = useOutletContext<MiAccount>();
    const navigate = useNavigate();
    return <Page header="买入">

    </Page>;
}

export function PageStockSell() {
    const miAccount = useOutletContext<MiAccount>();
    const navigate = useNavigate();
    return <Page header="卖出">

    </Page>;
}

/*
abstract class VStock extends VForm {
    protected beforeRender() {
        super.beforeRender();
        this.schema.unshift(
            { name: 'price', type: 'number', min: 0, required: true } as NumSchema,
        );
        this.uiSchema.items['price'] = {
            widget: 'number',
            min: 0,
            step: 1,
            label: '价格',
            placeholder: '股票价格',
            defaultValue: this.controller.holdingStock?.stockObj.price
            //rules: (value:any) => this.onCheckValue(value),
        } as UiNumberItem;
    }
}

abstract class VBuy extends VStock {
    protected beforeRender() {
        super.beforeRender();
        this.uiSchema.rules = [this.checkCash];
    }
    protected checkCash = (context: Context): string[] | string => {
        let { holdingStock, miAccount } = this.controller;
        let { cash } = miAccount;
        if (typeof cash !== 'number') return;
        let stock = holdingStock?.stockObj || this.controller.stock;
        let quantity = context.data.value;
        let { price } = stock;
        if ((quantity as number) * (price as number) > (cash as number))
            return `超过账户资金余额，无法买入`;
    }

    protected renderFormTop(): JSX.Element {
        return React.createElement(observer(() => {
            let { miAccount, holdingStock, stock } = this.controller;
            let { portionAmount, cash } = miAccount;
            if (typeof cash !== 'number') return null;
            if (!portionAmount) return null;
            let vComment: any;
            if (!stock && !holdingStock) {
                vComment = <>
                    <FA name="bell-o me-1 text-warning" />
                    建议不超过每份金额{portionAmount}
                </>;
            }
            else {
                if (!stock) {
                    stock = holdingStock.stockObj;
                }
                let { price } = stock;
                let quantity: number;
                if (holdingStock) {
                    quantity = portionAmount / price - holdingStock.quantity;
                    if (quantity < 0) quantity = 0;
                }
                else {
                    quantity = portionAmount / price;
                }
                vComment = quantity === 0 ?
                    <>
                        <FA name="times-circle-o me-1 text-danger" />
                        每份金额{portionAmount}，已超单只股票份额，建议不要购买
                    </>
                    :
                    <>
                        <FA name="check-circle-o me-1 text-warning" />
                        每份金额{portionAmount}，建议不超过：{Math.round(quantity)} 股
                    </>
            }

            return <div className="pb-3 px-3 text-center small text-muted">
                {vComment}
            </div>;
        }));
    }
}

export class VBuyNew extends VBuy {
    header() { return '新买股票' }
    protected beforeRender() {
        super.beforeRender();
        this.schema.unshift(
            { name: 'stock', type: 'id', required: true } as IdSchema,
        );
        this.uiSchema.items['stock'] = {
            widget: 'id',
            label: '股票',
            pickId: this.controller.createPickStockId(),
            placeholder: '请选择股票',
            Templet: this.renderStockPick,
        } as UiIdItem;
    }

    private renderStockPick = (values: Stock): JSX.Element => {
        let { name, no } = values;
        return <>{name} <small className="text-muted">{no}</small></>;
    }

    protected async onSubmit(data: any): Promise<void> {
        let { stock, price, value } = data;
        await this.controller.submitBuyNew(stock.id, price, value);
    }
}

export class VBuyExist extends VBuy {
    header() { return '加买股票' }
    protected get placeholder(): string { return '加买数量' }

    protected async onSubmit(data: any): Promise<void> {
        let { price, value } = data;
        await this.controller.submitBuy(price, value);
    }
}

export class VSell extends VStock {
    header() { return '卖出股票' }
    protected get placeholder(): string { return '卖出数量' }
    protected onCheckValue(value: any): string[] | string {
        let { holdingStock } = this.controller;
        let { quantity } = holdingStock;
        if (value > quantity)
            return `现有持股${quantity}，卖出数量超出`;
    }

    protected async onSubmit(data: any): Promise<void> {
        let { price, value } = data;
        await this.controller.submitSell(price, value);
    }

    protected renderQuantity(caption: string, value: number, dec: number = 0) {
        return <div className="mx-1 border border-info rounded w-min-5c px-1 py-2 cursor-pointer"
            onClick={this.onClickQuantity}>
            <small className="text-muted">{caption}</small>
            <div>{formatNumber(value ?? 0)}</div>
        </div>;
    }

    private onClickQuantity = () => {
        this.form.formContext.setValue('value', this.controller.holdingStock.quantity);
    }
}

export class VChangeCost extends VForm {
    header() { return '修改成本' }
    protected get valueLabel(): string { return '新成本' }
    protected get placeholder(): string { return '新股票成本' }
    protected get valueSchema(): ItemSchema {
        return { name: 'value', type: 'number', min: 0.01, required: true } as NumSchema;
    }
    protected beforeRender() {
        let { holdingStock } = this.controller;
        if (!holdingStock) return;
        let { cost, quantity } = holdingStock;
        let { value } = this.uiSchema.items;
        let uiValue = value as UiNumberItem;
        uiValue.min = 0.01;
        uiValue.step = 0.01;
        let oldPrice = cost / quantity;
        uiValue.defaultValue = oldPrice.toFixed(2);
    }
    protected async onSubmit(data: any): Promise<void> {
        let { value } = data;
        await this.controller.submitChangeCost(value);
    }
}
*/

export function ModalCashIn({ miAccount }: { miAccount: MiAccount; }) {
    const { closeModal } = useModal();
    //const miAccount = useOutletContext<MiAccount>();
    //const navigate = useNavigate();
    const formRows: FormRow[] = [
        { name: 'value', label: '调入金额', type: 'number', options: { validate: checkCash } },
        { type: 'submit' },
    ];
    function checkCash(value: number) {
        if (value <= 0)
            return `调入金额为负值`;
    }
    async function onSubmit(data: any) {
        let { value } = data;
        await miAccount.cashIn(value);
        closeModal();
        //navigate(-1);
    }
    return <FormAct
        onSubmit={onSubmit}
        formRows={formRows}
    />;
}
/*
export function PageCashIn() {
    return <Page header="调入资金">
        <ModalCashIn />
    </Page>;
}
*/

export function PageCashOut() {
    const miAccount = useOutletContext<MiAccount>();
    const navigate = useNavigate();
    const formRows: FormRow[] = [
        { name: 'value', label: '调出金额', type: 'number', options: { validate: checkCash } },
        { type: 'submit' },
    ];
    function checkCash(value: number) {
        let cash = useAtomValue(miAccount.cash);
        if (value > cash)
            return `调出金额不能超过总现金${cash}`;
    }
    async function onSubmit(data: any) {
        let { value } = data;
        await miAccount.cashOut(value);
        navigate(-1);
    }
    return <Page header="调出资金">
        <FormAct
            onSubmit={onSubmit}
            formRows={formRows}
        />
    </Page>;
}

export function PageCashAdjust() {
    const miAccount = useOutletContext<MiAccount>();
    const navigate = useNavigate();
    const formRows: FormRow[] = [
        { name: 'value', label: '调整金额', type: 'number', options: { validate: checkCash } },
        { type: 'submit' },
    ];
    function checkCash(value: number) {
        let cash = useAtomValue(miAccount.cash);
        if (value < 0 && -value > cash)
            return `负向调整金额不能超过总现金${cash}`;
    }
    async function onSubmit(data: any) {
        let { value } = data;
        await miAccount.cashAdjust(value);
        navigate(-1);
    }
    return <Page header="调整资金">
        <FormAct
            onSubmit={onSubmit}
            formRows={formRows}
        />
    </Page>;
}

export function PageCashInit() {
    const miAccount = useOutletContext<MiAccount>();
    const navigate = useNavigate();
    const formRows: FormRow[] = [
        { name: 'value', label: '资金数量', type: 'number', options: { validate: checkCash } },
        { type: 'submit' },
    ];
    function checkCash(value: number) {
        if (value < 0) return '初始资金不能是负数';
    }
    async function onSubmit(data: any) {
        let { value } = data;
        await miAccount.cashInit(value);
        navigate(-1);
    }
    return <Page header="初期资金">
        <FormAct
            onSubmit={onSubmit}
            formRows={formRows}
        />
    </Page>;
}
