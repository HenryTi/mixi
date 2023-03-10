import { useRef, useState } from "react";
import { atom, useAtomValue } from "jotai";
import { Page, PageConfirm, useModal } from "tonwa-app";
import { ButtonAsync, getAtomValue, List, LMR, Sep, setAtomValue, useEffectOnce } from "tonwa-com";
import { Product, SheetPurchase } from "uqs/JsTicket";
import { useUqApp } from "app/UqApp";
import { PageMoreCacheData } from "app/coms";
import { PartsProps } from "../Parts";
import { SheetParts } from "./SheetParts";

export function PageSheetEdit({ id, Parts, close }: PartsProps<SheetParts> & { id: number; close: () => void }) {
    const uqApp = useUqApp();
    const parts = uqApp.fromCache(Parts);
    const { uq, IDDetail, QueryGetDetails, ActBookSheet
        , caption, PageDetailItemSelect, PageSheetDetail, ViewItemDetail, IxMySheet
        , ViewNO, ViewTarget } = parts;
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
    });
    let btnSubmit: any, cnAdd: string;
    if (items.length === 0) {
        cnAdd = 'btn btn-primary me-3';
    }
    else {
        btnSubmit = <ButtonAsync className="btn btn-primary" onClick={onSubmit}>提交</ButtonAsync>;
        cnAdd = 'btn btn-outline-primary me-3';
    }
    const button = <LMR className="px-3 py-2">
        {btnSubmit}
        {visible === true && <>
            <button className={cnAdd} onClick={onAddDetail}>增加明细</button>
            <button className={'btn btn-outline-primary'} onClick={onRemoveSheet}>作废</button>
        </>}
    </LMR>;
    const { openModal, closeModal } = useModal();
    function removeSheetFromCache() {
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            data.removeItem<{ ix: number, xi: number }>(v => v.xi === sheetId) as any;
        }
    }
    async function onSubmit() {
        setVisible(false);
        await ActBookSheet.submit({ id: sheetId });
        removeSheetFromCache();
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
        close();
        // navigate(-1);
        //closeModal();
    }
    async function onAddDetail() {
        openModal(<PageDetailItemSelect onItemClick={onItemSelect} />);
    }
    async function onRemoveSheet() {
        let message = `单据 ${sheet.no} 真的要作废吗？`;
        let ret = await openModal(<PageConfirm header="确认" message={message} yes="单据作废" no="不作废" />);
        if (ret === true) {
            await uq.ActIX({ IX: IxMySheet, values: [{ ix: undefined, xi: -id }] });
            removeSheetFromCache();
            // closeModal();
            close();
        }
    }
    async function onItemSelect(item: Product) {
        let row = { sheet: sheetId, item: item.id };
        let ret = await openModal(<PageSheetDetail detail={row} Parts={Parts} />);
        if (!ret) {
            closeModal();
            return;
        }
        let { quantity } = ret;
        if (Number.isNaN(quantity) === true) {
            closeModal();
            return;
        }
        let value = { ...row, ...ret };
        let id = await uq.ActID({
            ID: IDDetail,
            value,
        });
        const items = getAtomValue(refItemsAtom.current);
        value.id = id;
        setAtomValue(refItemsAtom.current, [...items, value]);
        closeModal();
        onAddDetail();
    }
    function None() {
        return <div className="small text-muted px-3 py-3">[ 无明细 ]</div>;
    }
    async function onEditDetail(detail: any) {
        let ret = await openModal(<PageSheetDetail detail={detail} Parts={Parts} />);
        let newDetail = { ...detail, sheet: sheetId, ...ret }
        await uq.ActID({
            ID: IDDetail,
            value: newDetail
        })
        const items = getAtomValue(refItemsAtom.current);
        let index = items.findIndex(v => v.id === id);
        items.splice(index, 1, newDetail);
        setAtomValue(refItemsAtom.current, [...items]);
    }
    return <Page header="单据">
        <div className="py-2 tonwa-bg-gray-3 container">
            <ViewNO no={sheet.no} />
            <ViewTarget target={sheet.vendor} />
        </div>
        {items.length > 6 ? <>{button}<Sep /></> : <Sep />}
        <List items={items} ViewItem={ViewItemDetail} none={<None />} onItemClick={onEditDetail} />
        <Sep />
        {button}
    </Page>;
}
