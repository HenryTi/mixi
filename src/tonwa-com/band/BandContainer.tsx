import React, { useContext } from "react";
import { proxy } from "valtio";
import { BandTemplateProps } from "./Band";
import { BandContext } from "./BandContext";
import { FieldItem } from "../fields";

export type OnValuesChanged = (values: { name: string; value: any; preValue: any; }, context: BandContainerContext<any>) => Promise<void>;
export interface BandContainerProps {
    className?: string;
    children: React.ReactNode;
    stringClassName?: string;    // for string and number and date
    checkClassName?: string;     // for checkbox and radio
    pickClassName?: string;     // for pick
    values?: { [name: string]: any };
    BandTemplate?: (props: BandTemplateProps) => JSX.Element;
    readOnly?: boolean;
    onValuesChanged?: OnValuesChanged;
}

const defaultStringClassName = 'form-control';
const defaultCheckClassName = 'form-check-input';
const defaultSelectClassName = 'form-select';
const defaultPickClassName = 'form-control';
const defaultRangeClassName = 'form-range';

export abstract class BandContainerContext<P extends BandContainerProps> {
    readonly defaultStringClassName = defaultStringClassName;
    readonly defaultCheckClassName = defaultCheckClassName;
    readonly defaultSelectClassName = defaultSelectClassName;
    readonly defaultPickClassName = defaultPickClassName;
    readonly defaultRangeClassName = defaultRangeClassName;
    readonly defaultNone = '-';
    readonly fields: { [name: string]: FieldItem };
    readonly fieldStates: { [name: string]: { readOnly: boolean; disabled: boolean; } };
    readonly bands: BandContext[];
    readonly BandTemplate?: (props: BandTemplateProps) => JSX.Element;
    readonly props: P;
    readonly valueResponse: {
        values: { [name: string]: any };
    };
    readonly readOnly: boolean;

    constructor(props: P) {
        let { values, BandTemplate, readOnly } = props;
        this.bands = [];
        this.BandTemplate = BandTemplate;
        this.props = props;
        this.readOnly = readOnly;
        this.valueResponse = proxy({
            values: values ?? {},
        });
        this.fields = {};
        this.fieldStates = {};
        let each = (cs: React.ReactNode) => {
            React.Children.forEach(cs, c => {
                if (!c) return;
                if (React.isValidElement(c) === false) return;
                let e = c as JSX.Element;
                let { props: cProps } = e;
                if (cProps) {
                    let { name } = cProps;
                    if (name) this.fieldStates[name] = proxy({ readOnly: false, disabled: false });
                    each(cProps.children);
                }
            })
        }
        each(props.children);
    }

    abstract get isDetail(): boolean;
    onValuesChanged = async (values: any) => {
        let oldValues = this.valueResponse.values;
        for (let i in values) {
            let vNew = values[i];
            let vOld = oldValues[i];
            if (vNew !== vOld) {
                await this.props.onValuesChanged?.({ name: i, value: vNew, preValue: vOld }, this);
                oldValues[i] = vNew;
            }
        }
    }

    setValue(name: string, value: any) {
        let values: { [name: string]: any } = {};
        values[name] = value;
        this.onValuesChanged(values);
        this.valueResponse.values[name] = value;
    }

    setError(name: string, err: string[]): boolean {
        let hasError = false;
        for (let band of this.bands) {
            band.setError(name, err);
            if (hasError === false) {
                hasError = band.errors.length > 0;
            }
        }
        return hasError;
    }

    clearError(name: string): boolean {
        let hasError = false;
        for (let band of this.bands) {
            band.clearError(name);
            if (hasError === false) {
                hasError = band.errors.length > 0;
            }
        }
        return hasError;
    }

    clearAllErrors() {
        for (let band of this.bands) {
            band.clearAllErrors();
        }
    }

    setReadonly(name: string, readOnly: boolean) {
        let fieldState = this.fieldStates[name];
        if (fieldState) fieldState.readOnly = readOnly;
    }

    setDisabled(name: string, disabled: boolean) {
        let fieldState = this.fieldStates[name];
        if (fieldState) fieldState.disabled = disabled;
    }
}

export const VBandContainerContext = React.createContext<BandContainerContext<BandContainerProps>>(undefined);

export function useBandContainer() {
    return useContext(VBandContainerContext);
}
