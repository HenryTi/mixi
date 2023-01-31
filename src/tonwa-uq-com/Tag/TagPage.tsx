import { useEffect } from "react";
import { useNav, Page, FA, LMR, List, Sep } from "tonwa-com";
import { TagGroupPage } from './TagGroupPage';
import { UqTagProps, Tag, useUqTag, TagGroup } from "./UqTag";

interface Props {
    uqTagProps: UqTagProps;
    caption: string;
    icon: string;
    iconClass: string;
}

export function TagPage(props: Props) {
    let { uqTagProps, caption, icon, iconClass } = props;
    let { groups } = uqTagProps;
    let nav = useNav();
    let uqTag = useUqTag(uqTagProps);
    async function openTagGroup(group: TagGroup) {
        nav.open(<TagGroupPage uqTag={uqTag} icon={icon} group={group} />);
    }

    useEffect(() => {
        uqTag.loadGroups();
    }, [uqTag]);

    function TagGroupItem({ value: group }: { value: Tag; }) {
        let { id, name, vice } = group;
        return <LMR key={id}
            className="py-2 cursor-pointer mb-1 bg-white align-items-center"
        >
            <FA name={icon} className={iconClass + ' mx-3'} />
            <b>{vice ?? name}</b>
            <FA name="angle-right" className="me-3" />
        </LMR>;
    }

    return <Page header={caption}>
        <List className=""
            items={groups} ItemView={TagGroupItem} onItemClick={openTagGroup} />
        <Sep sep={2} />
    </Page >;
}
