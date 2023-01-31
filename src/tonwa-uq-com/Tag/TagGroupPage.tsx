import { useEffect } from "react";
import { FA, LMR } from "tonwa-com";
import { Page, useNav } from "tonwa-com";
import { BandCheck, BandString, ruleIsRequired } from "tonwa-com";
import { Form, Submit } from "tonwa-com";
import { Band } from "tonwa-com";
import { IDListEdit, useIdListEdit } from "../ID";
import { UqTag, TagWithItems, TagGroup } from "./UqTag";
import { EditTagPage } from "./EditTagPage";

interface Props {
    uqTag: UqTag;
    icon: string;
    group: TagGroup;
}

export function TagGroupPage(props: Props) {
    let { uqTag, icon, group } = props;
    let nav = useNav();
    let listEditContext = useIdListEdit(group.tags);

    useEffect(() => {
        async function loadGroup() {
            let tagGroup = await uqTag.loadGroup(group.name);
            listEditContext.setItems(tagGroup.tags);
        }
        loadGroup();
    }, [uqTag, group, listEditContext]);

    function TagView({ value: tag }: { value: TagWithItems }): JSX.Element {
        let { name, vice } = tag;
        return <LMR className="px-3 py-2 align-items-center">
            <FA name={icon} className="text-info me-3" />
            <div>{name}</div>
            <div className="ms-3 small text-muted">{vice}</div>
            <FA name="angle-right" />
        </LMR>
    }

    let renderFields = () => {
        return <>
            <BandString name="name" label="Name" maxLength={50} rule={ruleIsRequired} />
            <BandString name="vice" label="Discription" maxLength={100} />
            <BandCheck name="single" label="Singular" checkedValue={1} uncheckedValue={0} />
        </>;
    }

    let onTagClick = (tag: TagWithItems) => {
        nav.open(async () => {
            //uqTag.currentTag = tag;
            let onRemoveTag = async () => {
                //let { currentTag } = uqTag;
                let { name } = tag;
                let ret = await nav.confirm(`Do you really want to remove tag '${name}'?`);
                if (ret === true) {
                    await uqTag.removeTag(group, tag);
                    //onTagChanged(tag, true);
                    listEditContext.onItemDeleted(tag);
                    nav.close();
                }
            }
            return <EditTagPage {...props} tag={tag} onRemoveTag={onRemoveTag} renderFields={renderFields} />;
        });
    };

    let onTagAdd = () => {
        let onSubmit = async (data: any) => {
            await uqTag.saveTag(group, data);
            listEditContext.onItemChanged(data);
            nav.close();
        }
        nav.open(<Page header="Add tag">
            <div className="p-3">
                <Form values={{ single: 0 }}>
                    {renderFields()}
                    <Band>
                        <Submit onSubmit={onSubmit} />
                    </Band>
                </Form>
            </div>
        </Page>);
    }

    let { name, vice } = group;
    let right = <button className="btn btn-sm btn-outline-primary me-2"
        onClick={onTagAdd}>
        <FA name="plus" /> Tag
    </button>;
    return <Page header={vice ?? name} right={right}>
        <div className="">
            <IDListEdit context={listEditContext} ItemView={TagView} onItemClick={onTagClick} />
        </div>
    </Page>;
}
