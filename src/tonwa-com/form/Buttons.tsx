import React, { useEffect, useRef } from 'react';
import { proxy, useSnapshot } from 'valtio';
import { useBandContainer } from '../band';
import { ButtonAsync, FA } from '../coms';
import { EnumString, resStrings } from '../res';
import { checkRule, FieldItem } from '../fields';
import { useForm } from './FormContext';

export interface ButtonProps {
    name?: string;
    className?: string;
    children?: React.ReactNode;
    disabled?: boolean;
}

class SubmitItem implements FieldItem {
    readonly name: string;
    constructor(name: string, disabled: boolean) {
        this.name = name;
    }
    reset(): void {
    }
}

//const submitProxy = proxy({ readOnly: false, disabled: false });

export function Submit({ name, className, children, onSubmit, disabled }: ButtonProps & { onSubmit: (data: any) => Promise<[name: string, err: string][] | string[] | string | void>; }) {
    let form = useForm();
    let { hasError } = useSnapshot(form.errorResponse);
    let bandContainer = useBandContainer();
    let { fields, fieldStates } = bandContainer;
    let state = useRef({ readOnly: false, disabled }).current;
    let stateProxy = useRef(proxy(state)).current;
    let fieldState = useSnapshot(name ? fieldStates[name] : stateProxy);
    className = className ?? 'btn btn-primary';
    children = children ?? <><FA name='share-square-o' /> {resStrings[EnumString.string_submit]}</>;
    useEffect(() => {
        if (name) {
            fields[name] = new SubmitItem(name, disabled);
            Object.assign(fieldStates[name], { readOnly: undefined, disabled });
        }
    }, [fields, fieldStates, name, disabled]);
    async function onClick(evt: React.MouseEvent) {
        evt.preventDefault();
        let { props, valueResponse, errorResponse } = form;
        let { rule } = props;
        let errors = checkRule(valueResponse.values, rule);
        if (errors) {
            errorResponse.errors = errors;
            errorResponse.hasError = true;
        }
        else {
            let ret = await onSubmit(form.valueResponse.values);
            if (ret) {
                switch (typeof ret) {
                    default:
                        if (Array.isArray(ret) === true) {
                            for (let item of ret) {
                                if (!item) {
                                    form.clearAllErrors();
                                }
                                else if (Array.isArray(item) === true) {
                                    let [name, err] = item as [name: string, err: string];
                                    form.setError(name, err);
                                }
                                else {
                                    form.setError(undefined, ret as any as string);
                                }
                            }
                        }
                        break;
                    case 'string':
                        form.setError(undefined, ret);
                        break;
                }
            }
            else {
                form.clearAllErrors();
            }
        }
    }
    return <ButtonAsync onClick={onClick}
        disabled={(fieldState.disabled ?? false) || hasError}
        className={className}
    >
        {children}
    </ButtonAsync>;
}

export function Clear({ className, children }: ButtonProps) {
    let form = useForm();
    function onClick(evt: React.MouseEvent) {
        evt.preventDefault();
        form.clearValues();
    }
    return <button onClick={onClick} className={className}>
        {children}
    </button>;
}

export function ClearErrorsButton({ className, children }: ButtonProps) {
    let form = useForm();
    let { hasError } = useSnapshot(form?.errorResponse);
    function onClick(evt: React.MouseEvent) {
        evt.preventDefault();
        form.clearAllErrors();
    }
    return <button onClick={onClick} disabled={!hasError} className={className}>
        {children}
    </button>;
}
