import { useEffect, useState } from "react";
import { BandTemplateProps } from "tonwa-com";
import { Sep } from "tonwa-com";
import { UqTagProps, useUqTag, Tag, TagGroup, TagWithItems, UqTag } from "./UqTag";

interface Props {
    uqTagProps: UqTagProps;
    id: number;                 // ID id, id 对应的 tags
    className?: string;
    tagGroupName: string;
    BandTemplate?: (props: BandTemplateProps) => JSX.Element;
    top?: JSX.Element;
    bottom?: JSX.Element;
}

export function TagInput(props: Props) {
    let { uqTagProps, id, tagGroupName, className, BandTemplate, top, bottom } = props;
    let uqTag = useUqTag(uqTagProps);
    let [tg, setTg] = useState<[TagGroup, { [id: number]: boolean }]>(null);
    useEffect(() => {
        async function loadGroup() {
            await uqTag.loadGroups();
            let ret = await uqTag.loadGroup(tagGroupName); // loadGroup
            let ret1 = await uqTag.loadIDTags(ret, id)
            setTg([ret, ret1]);
        }
        loadGroup();
    }, [uqTag, tagGroupName, id]);

    if (!tg) return null;
    let [tagGroup, idTagValues] = tg;
    let { tags } = tagGroup;
    if (tags.length === 0) return null;
    BandTemplate = BandTemplate ?? DefaultBandTemplate;
    return <>
        {top}
        <div className={className}>
            {tags.map((v, index) => <TagItemInput key={index} sep={index === 0 ? null : undefined}
                uqTag={uqTag} tag={v} id={id}
                idTagValues={idTagValues}
                BandTemplate={BandTemplate} />)}
        </div>
        {bottom}
    </>;
}

interface TagItemInputProps {
    uqTag: UqTag;
    tag: TagWithItems;
    id: number;
    idTagValues: { [id: number]: boolean };
    BandTemplate: (props: BandTemplateProps) => JSX.Element;
    sep: number | JSX.Element;
}

function TagItemInput({ uqTag, tag, id, idTagValues, BandTemplate, sep }: TagItemInputProps) {
    let { name, items } = tag;
    let [tagArr, setTagArr] = useState<boolean[]>(
        idTagValues ? items.map(v => idTagValues[v.id] === true) : []
    );
    let onCheckChange = async (tag: TagWithItems, item: Tag, checked: boolean) => {
        let itemId = item.id;
        let { single, items } = tag;
        let values: { ix: number; xi: number; index: number }[] = [];
        if (single === 1) {
            let len = items.length;
            let iMe: number;
            for (let i = 0; i < len; i++) {
                let p = items[i];
                if (p === item) {
                    iMe = i;
                    continue;
                }
                let pid = p.id;
                if (tagArr[i] === true) {
                    values.push({ ix: id, xi: -pid, index: i });
                }
            }
            if (checked === false) throw Error('radio should not be false');
            values.push({ ix: id, xi: itemId, index: iMe });
        }
        else {
            let index = items.findIndex(v => v === item);
            values.push({ ix: id, xi: checked === true ? itemId : -itemId, index });
        }
        await uqTag.saveTagItems(values);
        for (let v of values) {
            let { xi, index } = v;
            let checkValue: boolean;
            if (xi < 0) {
                checkValue = false;
            }
            else {
                checkValue = true;
            }
            if (index !== undefined) {
                setTagArr(arr => {
                    let ret = [...arr];
                    ret[index] = checkValue;
                    return ret;
                });
            }
        }
    }

    function TagItem({ tag, item, index }: { tag: TagWithItems; item: Tag; index: number; }): JSX.Element {
        let { id, single, name } = tag;
        let type: string;
        let radioName: string;
        if (single === 1) {
            type = 'radio';
            radioName = 'tag-radio-' + name;
        }
        else {
            type = 'checkbox';
        }
        let checked = tagArr[index];
        return <label className="w-min-8c me-3 my-2 form-check-label">
            <input className="form-check-input me-2"
                type={type}
                name={radioName}
                defaultChecked={checked}
                value={id}
                onChange={evt => onCheckChange(tag, item, evt.currentTarget.checked)} />
            {item.name}
        </label>;
    }
    if (items.length === 0) return null;
    return <BandTemplate label={name} errors={undefined} memos={undefined} content={undefined} sep={sep} >
        {items.map((item: Tag, index: number) => <TagItem key={item.id} tag={tag} item={item} index={index} />)}
    </BandTemplate>;
}

function DefaultBandTemplate(props: BandTemplateProps) {
    let { label, children, sep } = props;
    let vLabel: any;
    let cnContent = 'col-sm-10 d-flex pe-0 align-items-center';
    if (label) {
        vLabel = <label className="col-sm-2 col-form-label text-sm-end tonwa-bg-gray-1 border-end py-3">
            <b>{label}</b>
        </label>;
    }
    else {
        cnContent += ' offset-sm-2';
    }
    return <>
        <Sep sep={sep} />
        <div className="row bg-white mx-0">
            {vLabel}
            <div className={cnContent}>
                <div className="flex-grow-1">
                    {children}
                </div>
            </div>
        </div>
    </>;
}
