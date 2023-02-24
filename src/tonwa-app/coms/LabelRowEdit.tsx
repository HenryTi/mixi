import { useMemo } from "react";
import { atom, useAtom } from "jotai";
import { FA, LabelRow, LabelRowPropsBase } from "tonwa-com";
import { useModal } from "../UqAppBase";

export interface EditProps {
    label: string | JSX.Element;
    value: string | number;
    onValueChanged?: (value: string | number) => Promise<void> | void;
    Edit?: (props: EditProps) => JSX.Element;
}

export function LabelRowEdit(props: LabelRowPropsBase & EditProps) {
    const { label, value: initValue, onValueChanged, Edit } = props;
    const { openModal, closeModal } = useModal();
    const atomValue = useMemo(() => atom(Number(initValue)), [initValue]);
    const [value, setValue] = useAtom(atomValue);
    async function onClick() {
        let ret = await openModal(<OneModal />, 'one modal');
        if (ret !== undefined) {
            setValue(ret);
        }
    }
    return <LabelRow {...props}>
        {label}
        <div>{value}</div>
        <div onClick={onClick} className="cursor-pointer p-3"><FA name="pencil" className="text-info" /></div>
    </LabelRow>;

    function OneModal() {
        const { openModal, closeModal } = useModal();
        const [value, setValue] = useAtom(atomValue);
        return <div className="p-3">
            modal title
            value: {value}
            <button onClick={() => setValue(Number(value) + 1)}>+</button>
            <button onClick={() => openModal(<ChildModal />)}>open</button>
            <button onClick={() => closeModal(value)}>return</button>
        </div>;
    }

    function ChildModal() {
        const [value, setValue] = useAtom(atomValue);
        let arr = [];
        for (let i = 0; i < 200; i++) {
            arr.push(<div key={i}>{i}</div>);
        }
        return <div className="p-3">
            {value}
            <button onClick={() => setValue(Number(value) + 1)}>+</button>
            child modal
            {arr}
        </div>;
    }
}
