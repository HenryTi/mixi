import { useCallback } from "react";

export function useT(...t: ((str: string) => any)[]): ((string: string) => any) {
    let callback = useCallback((str: string) => {
        for (let r of t) {
            let ret = r(str);
            if (ret) return ret;
        }
        return str;
    }, [t]);
    return callback;
}
