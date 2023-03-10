import { PageMoreCacheData, ViceTitle } from "app/coms";
import { useUqApp } from "app/UqApp";
import { ChangeEvent, FocusEvent, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page, PageConfirm, useModal } from "tonwa-app";
import { ButtonAsync, FA, List, LMR, useEffectOnce } from "tonwa-com";
import { ReturnGetDetailSourceQPAsRet, SheetStoreIn } from "uqs/JsTicket";
import { PageSourceSelect } from "./PageSourceSelect";

const sheetCaption = '入库单';
export function PageEdit() {
    const uqApp = useUqApp();
    const { JsTicket: uq } = uqApp.uqs;
    const { openModal, closeModal } = useModal();
    const navigate = useNavigate();
    const [sources, setSources] = useState([] as any[]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sheetStoreIn, setSheetStoreIn] = useState<SheetStoreIn>(undefined);
    const { id: paramId } = useParams();
    const refSheetSelected = useRef(false);
    useEffectOnce(() => {
        (async function () {
            if (paramId === undefined) {
                let sourceSelected = await openModal(<PageSourceSelect onSelected={onSourceSelected} />);
                if (sourceSelected !== true) {
                    navigate(-1);
                }
            }
            else {
                let sheetStoreInId = Number(paramId);
                let [sheet, { ret: details }] = await Promise.all([
                    uq.idObj(sheetStoreInId),
                    uq.GetDetailSourceQPAs.query({ id: sheetStoreInId }),
                ]);
                setSheetStoreIn(sheet);
                setSources([{ id: sheetStoreInId, details }]);
            }
        })();
    });
    async function onSourceSelected(source: any) {
        let index = sources.findIndex(v => v.id === source.id);
        if (index < 0) {
            let sourceId = source.id;
            let { ret } = await uq.GetDetailQPAs.query({ id: sourceId });
            source.details = ret.map(v => {
                let { id, sheet, quantity, price, amount } = v;
                let d: Partial<ReturnGetDetailSourceQPAsRet> = {
                    source: id,
                    sourceSheet: sheet,
                    sourceQuantity: quantity,
                    sourcePrice: price,
                    sourceAmount: amount,
                };
                return d;
            });
            if (sources.length === 0) {
                let IDSheet = uq.SheetStoreIn;
                let no = await uq.IDNO({ ID: IDSheet });
                let [id] = await uq.ActIX({
                    IX: uq.IxMySheet,
                    ID: IDSheet,
                    values: [{
                        ix: undefined,
                        xi: {
                            no, operator: undefined
                        }
                    }]
                });
                addSheetToCache(id);
                setSheetStoreIn({ id, no, operator: undefined });
            }
            setSources([...sources, source]);
            refSheetSelected.current = true;
        }
        closeModal(true);
    }
    function onSelectSheet() {
        openModal(<PageSourceSelect onSelected={onSourceSelected} />);
    }
    async function onSubmit() {
        setIsSubmitting(true);
        let ret = await uq.BookSheetStoreIn.submit({ id: sheetStoreIn.id });
        function addDetailOnOk() {
            closeModal();
            alert('新建');
        }
        await openModal(<Page header="提交成功" back="none">
            <div className="p-3">
                {sheetCaption} <b>{sheetStoreIn.no}</b> 已提交
            </div>
            <div className="border-top p-3">
                <button className="btn btn-outline-primary" onClick={closeModal}>返回</button>
                <button className="ms-3 btn btn-outline-secondary" onClick={addDetailOnOk}>新建{sheetCaption}</button>
            </div>
        </Page>);
        removeSheetFromCache();
        setIsSubmitting(false);
        navigate(-1);
    }

    function ViewItemSheet({ value }: { value: any }) {
        const [details, setDetails] = useState<any[]>(value.details);
        function ViewItemDetail({ value: detail }: { value: ReturnGetDetailSourceQPAsRet & { $changedValue: number; } }) {
            let inp = useRef(undefined as HTMLInputElement);
            let { id, source, sourceQuantity, value } = detail;
            let [disabled, setDisabled] = useState(false);
            async function changeValue(newValue: number) {
                if (newValue !== undefined) {
                    if (newValue < 0) newValue = 0;
                    else if (newValue > sourceQuantity) newValue = sourceQuantity;
                }
                else {
                    // 删除新值
                    newValue = 0;
                }
                if (newValue !== value) {
                    setDisabled(true);
                    if (newValue === 0 && id !== undefined) id = -id;
                    let retId = await uq.ActID({
                        ID: uq.DetailSource,
                        value: { id, sheet: sheetStoreIn.id, source, value: newValue }
                    });
                    if (id === undefined) detail.id = retId;
                    setDisabled(false);
                }
                detail.value = newValue;
                inp.current.value = String(newValue);
            }
            async function onClick() {
                let { value: inpValue } = inp.current;
                if (inpValue.trim().length > 0) return;
                await changeValue(sourceQuantity);
            }
            function onChange(e: ChangeEvent<HTMLInputElement>) {
                let { value: inpValue } = e.currentTarget;
                let n = Number(inpValue);
                if (Number.isNaN(n) === true) n = undefined;
                detail.$changedValue = n;
            }
            async function onBlur(e: FocusEvent<HTMLInputElement>) {
                let { value, $changedValue } = detail;
                if (value === undefined) return;
                await changeValue($changedValue);
            }
            return <LMR className="px-3 py-2 text-break align-items-end" onClick={onClick}>
                <div className="text-break">{JSON.stringify(detail)}</div>
                <div className="d-flex align-items-center">
                    <FA name="angle-right" className="ms-3 me-1" />
                    <input ref={inp} type="number"
                        className="form-control w-6c text-end"
                        defaultValue={value}
                        disabled={disabled}
                        onChange={onChange}
                        onBlur={onBlur} />
                </div>
            </LMR>
        }
        async function onLoadSource() {
            alert('调入源单，正在实现中...');
        }
        return <div>
            <ViceTitle className="text-break align-items-end">
                <span>source: {value.id}</span>
                <button className="btn btn-sm btn-link pb-0" onClick={onLoadSource}><FA name="plus" /></button>
            </ViceTitle>
            <List items={details} ViewItem={ViewItemDetail} itemKey={item => item.source} />
        </div>
    }
    function addSheetToCache(id: number) {
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (!data) return;
        data.items.unshift({ ix: undefined, xi: id });
    }
    function removeSheetFromCache() {
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (!data) return;
        data.removeItem<{ ix: number, xi: number }>(v => v.xi === sheetStoreIn.id) as any;
    }
    async function onRemoveSheet() {
        let message = `单据 ${sheetStoreIn.no} 真的要作废吗？`;
        let ret = await openModal(<PageConfirm header="确认" message={message} yes="单据作废" no="不作废" />);
        if (ret === true) {
            await uq.ActIX({ IX: uq.IxMySheet, values: [{ ix: undefined, xi: -sheetStoreIn.id }] });
            removeSheetFromCache();
            navigate(-1);
        }
    }
    function Top() {
        if (sheetStoreIn === undefined) return null;
        let { no } = sheetStoreIn;
        return <div className="tonwa-bg-gray-2 p-3">
            {sheetCaption}编号：{no}
        </div>;
    }
    return <Page header={sheetCaption}>
        <Top />
        <List items={sources} ViewItem={ViewItemSheet} itemKey={item => item.id} />
        <LMR className="px-3 py-2 text-end border-top">
            <ButtonAsync className="btn btn-primary" onClick={onSubmit}>
                提交
            </ButtonAsync>
            {
                isSubmitting === false && <span>
                    <button className="btn btn-outline-primary" onClick={onSelectSheet}>
                        <FA name="plus" className="me-1" /> 增加明细
                    </button>
                    <ButtonAsync className={'btn btn-outline-primary ms-3'} onClick={onRemoveSheet}>作废</ButtonAsync>
                </span>
            }
        </LMR>
    </Page>
}
