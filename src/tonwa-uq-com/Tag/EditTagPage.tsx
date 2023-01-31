import { Page, useNav, LMR, FA, Detail, BandString, Sep } from "tonwa-com";
import { MutedSmall } from "tonwa-com";
import { Form, Submit } from "tonwa-com";
import { Band } from "tonwa-com";
import { UqTag, Tag, TagWithItems } from "./UqTag";
import { IDListEdit, useIdListEdit } from "../ID";
import { ButtonAsync } from "tonwa-com";

interface Props {
    uqTag: UqTag;
    tag: TagWithItems;
    onRemoveTag: () => void;
    renderFields: () => JSX.Element;
}

export function EditTagPage({ uqTag, tag, onRemoveTag, renderFields }: Props) {
    let nav = useNav();
    let listEditContext = useIdListEdit(tag.items);
    let pageRight = <button className="btn btn-sm btn-outline-primary me-2" onClick={onRemoveTag}>
        <FA name="trash" /> Delete
    </button>;

    async function onDeleteItem(tagItem: Tag) {
        let { name } = tagItem;
        let ret = await nav.confirm(`Do you really want to remove tag '${name}'?`);
        if (ret === true) {
            await uqTag.removeTagItem(tag, tagItem);
            listEditContext.onItemDeleted(tagItem);
            nav.close();
        }
    }

    function FormTagItem({ tagItem, onSubmit, withDelete }: { tagItem: Tag; onSubmit: (data: Tag) => Promise<void>; withDelete?: boolean; }) {
        return <Form values={tagItem} className="container my-3">
            <BandString name="name" label="Name" />
            <Band>
                <LMR>
                    <Submit onSubmit={onSubmit} />
                    {withDelete && <ButtonAsync className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => onDeleteItem(tagItem)}>
                        Delete
                    </ButtonAsync>}
                </LMR>
            </Band>
        </Form>;
    }

    function onItemAdd() {
        function AddPage() {
            async function onAddSubmit(data: Tag) {
                let tagItemId = await uqTag.saveTagItem(tag, data);
                data.id = tagItemId;
                listEditContext.onItemChanged(data);
                nav.close();
            }
            return <Page header="Add tag">
                <FormTagItem tagItem={undefined} onSubmit={onAddSubmit} />
            </Page>;
        }
        nav.open(<AddPage />);
    }

    function onItemEdit(tagItem: Tag) {
        async function onEditSubmit(data: Tag) {
            let name = data['name']
            await uqTag.saveTagItemName(data, name);
            listEditContext.onItemChanged(data);
            nav.close();
        }
        function EditPage() {
            return <Page header="Edit 1 tag item">
                <FormTagItem tagItem={tagItem} onSubmit={onEditSubmit} withDelete={true} />
            </Page>;
        }
        nav.open(<EditPage />)
    }
    return <Page header={'Edit'} right={pageRight}>
        <div>
            <Detail values={tag}>
                {renderFields()}
            </Detail>
            <Sep sep={2} />
            <LMR className="mt-4 mb-1 px-3 bg-light">
                <b>Items</b>
                <button className="btn btn-sm btn-primary"
                    onClick={onItemAdd}>
                    <FA name="plus" /> Item
                </button>
            </LMR>
            <Sep sep={2} />
            <IDListEdit none={<MutedSmall className="d-block m-3">no items</MutedSmall>}
                context={listEditContext}
                ItemView={ItemView} onItemClick={onItemEdit} />
            <Sep sep={2} />
        </div>
    </Page>;
}

function ItemView({ value: tagItem }: { value: Tag }) {
    let { name } = tagItem;
    return <LMR className="px-3 py-2 align-items-center">
        <FA className="text-info me-3" name="chevron-circle-right" />
        <span>{name}</span>
        <span></span>
    </LMR>;
}
