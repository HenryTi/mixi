import { useEffect, useState } from "react";

export function usePromiseResult<T>(promiseFunc: () => Promise<T>) {
    let [value, setValue] = useState<T>();
    useEffect(() => {
        const func = async () => {
            let r = await promiseFunc();
            setValue(r);
        }
        func();
    }, [promiseFunc]);
    return value;
}
