import React, { useContext } from 'react';
import { proxy } from 'valtio';
import { BandContainerContext } from '../band';
import { FormProps } from './Form';

export class FormContext extends BandContainerContext<FormProps> {
    readonly errorResponse: {
        hasError: boolean;
        errors: string[];
    };

    constructor(props: FormProps) {
        super(props);
        this.errorResponse = proxy({
            hasError: false,
            errors: undefined,
        });
    }

    get isDetail(): boolean {
        return false;
    }

    setError(name: string, err: string | string[]): boolean {
        if (!err) return;
        if (Array.isArray(err) === false) err = [err as string];
        if (!name) {
            if (err && err.length > 0) {
                this.errorResponse.errors = [...(err as string[])];
                this.errorResponse.hasError = true;
            }
            return;
        }
        let hasError = super.setError(name, err as string[]);
        if (hasError === true) {
            this.errorResponse.hasError = hasError;
        }
        return hasError;
    }

    clearError(name: string): boolean {
        let hasError = super.clearError(name);
        this.errorResponse.hasError = hasError;
        this.errorResponse.errors = undefined;
        return hasError;
    }

    clearAllErrors() {
        super.clearAllErrors();
        this.errorResponse.hasError = false;
    }

    clearValues() {
        let { values } = this.valueResponse;
        for (let i in values) {
            values[i] = undefined;
        }
        for (let i in this.fields) {
            this.fields[i].reset();
        }
        this.clearAllErrors();
    }
}

export const VFormContext = React.createContext<FormContext>(undefined);

export function useForm() {
    return useContext(VFormContext);
}
