import * as React from 'react';
import { env } from '../tools';

export interface SearchBoxProps {
    className?: string;
    label?: string;
    initKey?: string;
    placeholder?: string;
    buttonText?: string;
    maxLength?: number;
    size?: 'sm' | 'md' | 'lg';
    inputClassName?: string;
    onSearch: (key: string) => Promise<void>;
    onFocus?: () => void;
    allowEmptySearch?: boolean;
}

export function SearchBox(props: SearchBoxProps) {
    let { className, inputClassName, onFocus,
        label, placeholder, buttonText, maxLength, size } = props;

    let input: HTMLInputElement;
    let button: HTMLButtonElement;
    let key: string = null;

    function onChange(evt: React.ChangeEvent<any>) {
        key = evt.target.value;
        if (key !== undefined) {
            key = key.trim();
            if (key === '') key = undefined;
        }
        console.log('key = ' + key);
        if (props.allowEmptySearch === true) {
        }
        else {
            button.disabled = key === undefined || key.length === 0;
        }
    }
    async function onSubmit(evt: React.FormEvent<any>) {
        evt.preventDefault();
        if (key === null) key = props.initKey || '';
        if (props.allowEmptySearch !== true) {
            if (!key) return;
            if (input) input.disabled = true;
            if (button) button.disabled = true;
        }
        await props.onSearch(key);
        if (input) input.disabled = false;
        if (button) button.disabled = false;
    }

    let inputSize: string;
    switch (size) {
        default:
        case 'sm': inputSize = 'input-group-sm'; break;
        case 'md': inputSize = 'input-group-md'; break;
        case 'lg': inputSize = 'input-group-lg'; break;
    }
    let autoComplete: string;
    if (env.isMobile === true) autoComplete = 'off';
    return <form className={className} onSubmit={onSubmit} autoComplete={autoComplete}>
        <div className={"input-group " + inputSize}>
            {label && <div className="input-group-addon align-self-center me-2">{label}</div>}
            <input ref={v => input = v} onChange={onChange}
                type="text"
                name="key"
                onFocus={onFocus}
                className={'form-control ' + (inputClassName ?? 'border-primary')}
                placeholder={placeholder}
                defaultValue={props.initKey}
                maxLength={maxLength} />
            <div className="input-group-append">
                <button ref={v => button = v} className="btn btn-primary"
                    type="submit"
                    disabled={props.allowEmptySearch !== true}>
                    <i className='fa fa-search' />
                    <i className="fa" />
                    {buttonText}
                </button>
            </div>
        </div>
    </form>;
}
