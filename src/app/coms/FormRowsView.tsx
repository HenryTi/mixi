import { HTMLInputTypeAttribute, ReactNode } from "react";
import { UseFormRegisterReturn, FieldErrorsImpl, RegisterOptions, UseFormRegister } from "react-hook-form";

export interface BandProps {
    label?: string | JSX.Element;
    labelClassName?: string;
    children: ReactNode;
}

export interface BandInputProps {
    label?: string;
    type: HTMLInputTypeAttribute,
    inputProps: UseFormRegisterReturn,
    errors?: Partial<FieldErrorsImpl<{
        [x: string]: any;
    }>>;
    defaultValue?: string;
}

function registerOptions(type: HTMLInputTypeAttribute, options: RegisterOptions): RegisterOptions {
    switch (type) {
        default: return options;
        case 'number':
            return Object.assign({}, options, { valueAsNumber: true });
    }
}

export function BandInput(props: BandInputProps) {
    const { label, inputProps, errors, type, defaultValue } = props;
    const { name } = inputProps;
    let error = errors[name];
    let cnInput = 'form-control ';
    if (error) cnInput += 'is-invalid';
    return <Band label={label}>
        <input {...inputProps} className={cnInput} type={type} defaultValue={defaultValue} />
        {error && <div className="invalid-feedback mt-1">
            {error.message?.toString()}
        </div>}
    </Band>
}

export function Band({ label, labelClassName, children }: BandProps) {
    return <div className={'mb-3 row'}>
        <label className={(labelClassName ?? '') + ' form-label col-2'}>{label}</label>
        <div className="col-10" >
            {children}
        </div>
    </div>;
}

export interface BandInputsProps {
    label?: string;
    register: UseFormRegister<any>;
    inputs: FormInput[];
}
export function BandInputs({ inputs: checks, register, label }: BandInputsProps) {
    return <Band label={label}>
        {checks.map((v, index) => {
            const { name, label } = v;
            return <label key={index} className="form-check-label me-3">
                <input className="form-check-input me-1" type="checkbox" {...register(name)} />
                {label ?? name}
            </label>;
        })}
    </Band>
}

interface FormLabel {
    label?: string;
}

interface FormLabelName extends FormLabel {
    name: string;
    placeHolder?: string;
}

export interface FormInput extends FormLabelName {
    type: HTMLInputTypeAttribute,
    options?: RegisterOptions,
}

export interface FormBand extends FormLabel {
    inputs: FormInput[];
}

export interface FormRadios extends FormLabelName {
    default?: string | number;
    radios: { label: string; value: string | number }[];
    options?: RegisterOptions,
}

export interface FormSelect extends FormLabelName {
    multiple?: boolean;
    default?: string | number | boolean;
    items: { label: string; value: string | number }[];
    options?: RegisterOptions,
}

export interface FormSubmit extends FormLabel {
    type: 'submit';
}

export type FormRow = FormInput | FormBand | FormSubmit | FormRadios | FormSelect;

export interface FormRowsViewProps {
    rows: (FormRow)[];
    register: UseFormRegister<any>;
    errors?: Partial<FieldErrorsImpl<{
        [x: string]: any;
    }>>;
}
export function FormRowsView({ rows, register, errors }: FormRowsViewProps) {
    function FormRowView({ row }: { row: FormRow; }) {
        const { label, inputs } = row as FormBand;
        if (inputs !== undefined) {
            return <Band label={label}>{
                inputs.map((v, index) => {
                    const { label, name, type, options } = v;
                    if (type === 'checkbox') {
                        return <label key={index} className="form-check-label me-3">
                            <input className="form-check-input me-1"
                                type="checkbox" {...register(name)} />
                            {label ?? name}
                        </label>;
                    }
                    else {
                        let newOptions = registerOptions(type, options);
                        <input className="form-check-input me-1" type={type} {...register(name, newOptions)} />
                        { label ?? name }
                    }
                })
            }</Band>
        }

        const { radios } = row as FormRadios;
        if (radios !== undefined) {
            const { name, default: defaultValue } = row as FormRadios;
            return <Band label={label}>
                {
                    radios.map((v, index) => {
                        const { label, value } = v;
                        return <label key={index} className="form-check-label me-3">
                            <input className="form-check-input me-1"
                                defaultChecked={value === defaultValue}
                                value={value}
                                type="radio" {...register(name)} />
                            {label ?? name}
                        </label>
                    })
                }
            </Band>
        }

        const { items } = row as FormSelect;
        if (items !== undefined) {
            const { name, multiple, default: defaultValue, placeHolder, options } = row as FormSelect;
            let error = errors[name];
            let cnInput = 'form-select ';
            if (error) cnInput += 'is-invalid';
            const n = '\n';
            if (options !== undefined) {
                if (options.required === true) {
                    options.validate = v => {
                        let ret = v !== n;
                        console.error('select ' + v + ' ret ' + ret);
                        return ret;
                    }
                }
            }
            return <Band label={label}>
                <select multiple={multiple} className={cnInput} {...register(name, options)}>
                    {
                        defaultValue === undefined &&
                        <option selected={true} disabled={true} value={n}>
                            {placeHolder ?? '请选择' + label}
                        </option>
                    }
                    {items.map((v, index) => {
                        const { label, value } = v;
                        return <option key={index} value={value} selected={defaultValue === value}>{label}</option>
                    })}
                </select>
                {
                    error && <div className="invalid-feedback mt-1">
                        {error.message?.toString()}
                    </div>
                }
            </Band>
        }

        const { name, type, options } = row as FormInput;
        switch (type) {
            default:
                let newOptions = registerOptions(type, options);
                return <BandInput label={label} type={type} errors={errors}
                    inputProps={register(name, newOptions)} defaultValue={options?.value} />;
            case 'submit':
                return <Band><input type="submit" className="btn btn-primary" value={label ?? '提交'} /></Band>;
        }
    }
    return <>{rows.map((row, index) => <FormRowView key={index} row={row} />)}</>
}
