import { FA } from "../coms";

interface Props {
    label?: string;

    children: React.ReactNode;
    rightIcon?: string | JSX.Element;
    onEdit?: () => void;
}

export function LabelBand({ label, children, rightIcon, onEdit }: Props) {
    return <div className="row bg-white mx-0">
        {
            label ?
                <label className="col-sm-2 col-form-label text-sm-end tonwa-bg-gray-1 border-end align-self-center py-3">
                    <b>{label}</b>
                </label>
                :
                <label className="col-sm-2 py-3"></label>
        }
        <div className="col-sm-10 d-flex pe-0 align-items-center">
            <div className="flex-grow-1">
                <div>{children}</div>
            </div>
            {(onEdit || rightIcon) &&
                <div onClick={onEdit}
                    className="px-3 align-self-stretch d-flex align-items-center cursor-pointer"
                >
                    {rightIcon ?? <FA name="pencil" className="text-info" />}
                </div>
            }
        </div>
    </div>;
}
