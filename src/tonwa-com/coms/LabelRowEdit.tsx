import { useRef } from "react";
import { useModal } from "tonwa-uq-com";
import { proxy, useSnapshot } from "valtio";
import { FA } from "./FA";
import { LabelRow, LabelRowPropsBase } from "./LabelRow";

export interface EditProps {
    label: string | JSX.Element;
    value: string | number;
    onValueChanged?: (value: string | number) => Promise<void> | void;
    Edit?: (props: EditProps) => JSX.Element;
}

export function LabelRowEdit(props: LabelRowPropsBase & EditProps) {
    const { label, value: initValue, onValueChanged, Edit } = props;
    const { openModal, closeModal } = useModal();
    const { current: proxyValue } = useRef(proxy({ value: initValue }));
    async function onClick() {
        let ret = await openModal(<OneModal />, 'one modal');
        if (ret !== undefined) {
            proxyValue.value = ret;
        }
    }
    function Value() {
        let { value } = useSnapshot(proxyValue);
        return <div>{value}</div>;
    }
    return <LabelRow {...props}>
        {label}
        <Value />
        <div onClick={onClick}><FA name="pencil" className="text-info" /></div>
    </LabelRow>;

    function OneModal() {
        const { openModal, closeModal } = useModal();
        let { value } = useSnapshot(proxyValue);
        return <div className="p-3">
            modal title
            value: {value}
            <button onClick={() => proxyValue.value = Number(value) + 1}>+</button>
            <button onClick={() => openModal(<ChildModal />)}>open</button>
            <button onClick={() => closeModal(value)}>return</button>
        </div>;
    }

    function ChildModal() {
        let { value } = useSnapshot(proxyValue);
        let arr = [];
        for (let i = 0; i < 200; i++) {
            arr.push(<div key={i}>{i}</div>);
        }
        return <div className="p-3">
            {value}
            <button onClick={() => proxyValue.value = Number(value) + 1}>+</button>
            child modal
            {arr}
        </div>;
    }
}
