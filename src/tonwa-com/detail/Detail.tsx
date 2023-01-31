import React, { useContext, useRef } from "react";
import { FA, Sep } from "../coms";
import { Form, Submit } from "../form";
import { Page, useNav } from "../page";
import { Band, BandContainerContext, BandContainerProps, BandContentType, BandFieldErrors, BandMemos, BandTemplateProps, useBand, useBandContainer, VBandContainerContext } from "../band";

interface DetailProps extends BandContainerProps {
}

class DetailContext extends BandContainerContext<DetailProps> {
    get isDetail(): boolean {
        return true;
    }
}

const DetailContextContainer = React.createContext<DetailContext>(undefined);
export function useDetail() {
    return useContext(DetailContextContainer);
}

export function Detail(props: DetailProps) {
    let { className, children, BandTemplate } = props;
    BandTemplate = BandTemplate ?? DefaultBandTemplate;
    let { current: detailContext } = useRef(new DetailContext({ ...props, BandTemplate }));
    return <DetailContextContainer.Provider value={detailContext}>
        <VBandContainerContext.Provider value={detailContext}>
            <div className={className}>
                {children}
            </div>
        </VBandContainerContext.Provider>
    </DetailContextContainer.Provider>;
}

function DefaultBandTemplate(props: BandTemplateProps) {
    let nav = useNav();
    let bandContainer = useBandContainer();
    let band = useBand();
    let { label, children, errors, memos, onEdit, content, sep, contentType, rightIcon } = props;
    let labelContent = contentType === BandContentType.check ? null : <b>{label}</b>;
    let vLabel = <label className="col-sm-2 col-form-label text-sm-end tonwa-bg-gray-1 border-end align-self-center py-3">
        {labelContent}
    </label>;
    let cnContent = 'col-sm-10 d-flex pe-0 align-items-center';
    function RightIcon({ icon, onEdit }: { icon: JSX.Element; onEdit: () => Promise<void>; }) {
        return <div onClick={onEdit}
            className="px-3 align-self-stretch d-flex align-items-center cursor-pointer"
        >
            {icon ?? <FA name="pencil" className="text-info" />}
        </div>;
    }

    if (band.readOnly === true) {
        rightIcon = null;
    }
    else if (contentType === BandContentType.com) {
        if (onEdit) {
            rightIcon = <RightIcon onEdit={onEdit} icon={rightIcon} />;
        }
    }
    else {
        onEdit = onEdit ?? async function () {
            nav.open(<ValueEditPage label={label}
                content={content}
                values={{ ...bandContainer.valueResponse.values }}
                onValuesChanged={bandContainer.onValuesChanged}
            />);
        }
        rightIcon = <RightIcon onEdit={onEdit} icon={rightIcon} />;
    }
    return <>
        <Sep sep={sep} />
        <div className="row bg-white mx-0">
            {vLabel}
            <div className={cnContent}>
                <div className="flex-grow-1">
                    <div>{children}</div>
                    <BandFieldErrors errors={errors} />
                    <BandMemos memos={memos} />
                </div>
                {rightIcon}
            </div>
        </div>
    </>;
}

interface ValueEditPageProps {
    label: string | JSX.Element;
    content: React.ReactNode;
    values: any;
    onValuesChanged: (values: any) => Promise<void>;
}
function ValueEditPage({ content, label, values, onValuesChanged }: ValueEditPageProps) {
    let nav = useNav();
    async function onSubmit(data: any) {
        await onValuesChanged(data);
        nav.close();
    }
    return <Page header={label} back="close">
        <Form className="container px-3 py-3" values={values} BandTemplate={ValueEditBandTemplate}>
            <Band>
                {content}
            </Band>
            <Submit onSubmit={onSubmit} />
        </Form>
    </Page>;
}

function ValueEditBandTemplate(props: BandTemplateProps) {
    let { children, errors, memos } = props;
    return <div className="bg-white mb-3">
        {children}
        <BandFieldErrors errors={errors} />
        <BandMemos memos={memos} />
    </div>;
}
