import React, { useContext } from "react";
import { proxy } from "valtio";
import { BandContainerContext } from "./BandContainer";

interface NamedError {
    name: string;
    error: string;
}

export class BandContext {
    readonly container: BandContainerContext<any>;
    readonly errors: NamedError[];
    readonly memos?: string[];
    readonly fields: { [name: string]: boolean };
    readOnly: boolean = false;

    constructor(container: BandContainerContext<any>, memos?: string[]) {
        this.container = container;
        this.errors = proxy([]);
        this.memos = memos;
        this.fields = {};
        container?.bands.push(this);
    }

    setError(name: string, error: string[]) {
        if (this.fields[name] === true) {
            if (error) {
                for (let err of error) {
                    this.errors.push({ name, error: err });
                }
            }
        }
    }

    clearError(name: string) {
        let last = this.errors.length - 1;
        for (let i = last; i >= 0; i--) {
            let err = this.errors[i];
            if (err.name === name) {
                this.errors.splice(i, 1);
            }
        }
    }

    clearAllErrors() {
        this.errors.splice(0);
    }
}

export const VBandContext = React.createContext<BandContext>(undefined);

export function useBand() {
    return useContext(VBandContext);
}
