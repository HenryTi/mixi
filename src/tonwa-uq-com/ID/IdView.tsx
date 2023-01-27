import { useState } from "react";
import { useEffectOnce } from "tonwa-com";
import { Uq } from "tonwa-uq";
import { ID, UqID } from "tonwa-uq";

interface Props<T = any> {
    id: number;
    uq: Uq;
    ID?: UqID<T>;
    Template: (props: { value: T; }) => JSX.Element;
}

export function IdView({ id, uq, Template, ID }: Props) {
    if (ID !== undefined) {
        return <IdViewID uq={undefined} ID={ID} id={id} Template={Template} />;
    }
    else {
        return <IdViewInternal uq={uq} ID={ID} id={id} Template={Template} />;
    }
}

function IdViewInternal({ id, uq, Template }: Props) {
    let [value, setValue] = useState<any>(undefined);
    useEffectOnce(() => {
        async function getValue() {
            let obj = await uq.idObj(id); //.ID({ id, IDX: undefined }); cache[id];
            setValue(obj);
        }
        getValue();
    });
    if (value === null || value === undefined) return null;
    return <Template value={value} />;
}

const maxArr = 2000;
interface IDCache {
    ID: ID;
    values: { [id: number]: any };
    arr: number[];
    promises: { [id: number]: Promise<any> };
}
const caches: { [IDType: string]: IDCache } = {};

function IdViewID<T extends { id?: number; }>({ id, ID, Template }: Props<T>) {
    let [value, setValue] = useState<T>(undefined);
    useEffectOnce(() => {
        async function getValue() {
            let IDName = ID.name;
            let idCache = caches[IDName];
            if (idCache === undefined) {
                idCache = { ID, values: {}, arr: [], promises: {} };
                caches[IDName] = idCache;
            }
            let { values, arr } = idCache;
            let val = values[id];
            if (val === undefined) {
                let { promises } = idCache;
                let promise = promises[id];
                if (promise === undefined) {
                    promise = (ID.uq as any).ID({ IDX: ID, id })
                    promises[id] = promise;
                }
                let ret = await promise; // (ID.uq as any).ID({ IDX: ID, id });
                val = ret[0];
                if (val === undefined) {
                    val = values[id] = null;
                }
                else {
                    values[id] = val;
                }
                delete promises[id];
            }
            else {
                let index = arr.findIndex(v => v === id);
                if (index >= 0) arr.splice(index, 1);
            }
            arr.push(id);
            if (arr.length > maxArr) {
                arr.shift();
            }
            setValue(val);
        }
        getValue();
    });
    if (!value) return null;
    return <Template value={value ?? ({ id: undefined } as T)} />;
}
