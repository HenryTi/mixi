import { useRef } from "react";
import { ID, IX, Uq } from "tonwa-uq";

export interface Tag {
    id?: number;
    name: string;
    vice?: string;
    single?: number;
}

export interface TagWithItems extends Tag {
    items: Tag[];
}

export interface TagGroup extends Tag {
    tick?: number;
    tags: TagWithItems[];
}

export interface UqTagProps {
    uq: Uq;
    TagGroup: ID;
    Tag: ID;
    TagItem: ID;
    IxTag: IX;
    IxIDTag: IX;
    groups: TagGroup[];
}

export class UqTag {
    static catch: [Uq, UqTag][] = [];
    static create(uqTagProps: UqTagProps): UqTag {
        let { uq: uqInProps } = uqTagProps;
        let catched = UqTag.catch.find(v => {
            let [uq] = v;
            return uq === uqInProps;
        });
        if (catched !== undefined) {
            return catched[1];
        }
        let ret = new UqTag(uqTagProps);
        UqTag.catch.push([uqInProps, ret]);
        return ret;
    }
    private readonly uq: Uq;
    private readonly TagGroup: ID;
    private readonly Tag: ID;
    private readonly TagItem: ID;
    private readonly IxTag: IX;
    private readonly IxIDTag: IX;
    private readonly groups: Tag[];
    private readonly tagGroups: { [group: string]: TagGroup } = {};
    // currentTag: TagWithItems;

    private constructor({ uq, TagGroup, Tag, TagItem, IxTag, IxIDTag, groups }: UqTagProps) {
        this.uq = uq;
        this.TagGroup = TagGroup;
        this.IxTag = IxTag;
        this.Tag = Tag;
        this.TagItem = TagItem;
        this.IxIDTag = IxIDTag;
        this.groups = groups;
    }

    is(uq: Uq, IxTag: IX, Tag: ID, TagItem: ID): boolean {
        return uq === this.uq
            && IxTag === this.IxTag
            && Tag === this.Tag
            && TagItem === this.TagItem;
    }

    async getTags(group: Tag) {
        let ret = await this.uq.IX<Tag>({
            IX: this.IxTag,
            ix: group.id,
            IDX: [this.Tag],
        });
        return ret;
    }

    async getTagItems(tag: Tag) {
        let ret = await this.uq.IX<Tag>({
            IX: this.IxTag,
            ix: tag.id,
            IDX: [this.TagItem],
        });
        return ret;
    }

    // return: tag id
    async saveTag(group: TagGroup, tag: TagWithItems) {
        let ret = await this.uq.ActIX<Tag>({
            IX: this.IxTag,
            ID: this.Tag,
            values: [{ ix: group.id, xi: tag }]
        });
        tag.id = ret[0];
        let { tags } = group;
        if (!tags) {
            tags = group.tags = [];
        }
        let p = tags.findIndex(v => v.id === tag.id);
        if (p >= 0) {
            Object.assign(tags[p], tag);
        }
        else {
            if (!tag.items) tag.items = [];
            group.tags.push(tag);
        }
    }

    async removeTag(group: TagGroup, tag: TagWithItems) {
        let { id } = group;
        await this.uq.ActIX({
            IX: this.IxTag,
            values: [{
                ix: id,
                xi: -tag.id,
            }],
        });
        let { tags } = group;
        if (tags) {
            let p = tags.findIndex(v => v.id === tag.id);
            if (p >= 0) tags.splice(p, 1);
        }
    }

    async saveTagProp(tag: Tag, name: string, value: string) {
        await this.uq.ActIDProp(this.Tag, tag.id, name, value);
    }

    async saveTagItemName(tagItem: Tag, value: string) {
        await this.uq.ActIDProp(this.TagItem, tagItem.id, 'name', value);
    }

    async removeTagItem(tag: Tag, tagItem: Tag) {
        let { id } = tag;
        await this.uq.ActIX({
            IX: this.IxTag,
            values: [{ ix: id, xi: -tagItem.id }]
        });
        /*
        let p = items.findIndex(v => v.id === tagItem.id);
        if (p >= 0) items.splice(p, 1);
        */
    }

    async saveTagItem(tag: Tag, tagItem: Tag): Promise<number> {
        let ret = await this.uq.ActIX<Tag>({
            IX: this.IxTag,
            ID: this.TagItem,
            values: [{ ix: tag.id, xi: tagItem }]
        });
        return ret[0];
        /*
        let { items } = this.currentTag;
        let id = ret[0];
        tagItem.id = id;
        let p = items.findIndex(v => v.id === id);
        if (p >= 0) {
            Object.assign(items[p], tagItem);
        }
        else {
            this.currentTag.items.push({ ...tagItem });
        }
        return id;
        */
    }

    async saveTagItems(values: { ix: number; xi: number; index: number }[]): Promise<void> {
        await this.uq.ActIX({
            IX: this.IxIDTag,
            values,
        });
    }

    private groupsLoaded = false;
    resetGroups() {
        for (let i in this.tagGroups) {
            let tagGroup = this.tagGroups[i];
            tagGroup.tick = 0;
        }
        this.groupsLoaded = false;
    }

    async loadGroups() {
        if (this.groupsLoaded === true) return;
        let ret = await this.uq.ID<Tag>({
            IDX: this.TagGroup,
            id: undefined,
        });
        for (let group of this.groups) {
            let g = ret.find(v => v.name === group.name);
            if (!g) {
                throw Error(`${group.name} is not defined in UQ`);
            }
            group.id = g.id;
        }
        this.groupsLoaded = true;
    }

    async loadGroup(tagGroupName: string): Promise<TagGroup> {
        let tagGroup = this.tagGroups[tagGroupName];
        if (tagGroup !== undefined) {
            let { tick } = tagGroup;
            if (Date.now() - tick < 3600 * 1000) {
                return tagGroup;
            }
            this.tagGroups[tagGroupName] = tagGroup = undefined;
        }
        let group = this.groups.find(v => v.name === tagGroupName);
        if (group === undefined) return;
        let ret = await this.uq.IX<Tag>({
            IX: this.IxTag,
            ix: group.id,
            IDX: [this.Tag],
        });
        let retItems = await this.uq.IX<Tag>({
            IX: this.IxTag,
            IX1: this.IxTag,
            ix: group.id,
            IDX: [this.TagItem],
        });
        let tagColl: { [tag: number]: TagWithItems } = {};
        let tags: TagWithItems[] = [];
        for (let row of ret) {
            let tag: TagWithItems = {
                items: [],
                ...row
            };
            tagColl[row.id] = tag;
            tags.push(tag);
        }
        for (let row of retItems) {
            let { ix } = row as any;
            let tag = tagColl[ix];
            if (!tag) continue;
            tag.items.push(row);
        }
        tagGroup = {
            name: group.name,
            tick: Date.now(),
            tags,
        };
        return this.tagGroups[tagGroupName] = tagGroup;
    }

    async loadIDTags(tagGroup: TagGroup, id: number): Promise<{ [id: number]: boolean }> {
        let idCheckedMap: { [id: number]: boolean } = {};
        let ret = await this.uq.IX<{ ix: number, xi: number }>({
            IX: this.IxIDTag,
            ix: id,
        });
        for (let row of ret) {
            let { xi } = row;
            idCheckedMap[xi] = true;
        }
        // assure radio box only show single value
        for (let tag of tagGroup.tags) {
            let { single, items } = tag;
            if (single !== 1) continue;
            let checked = false;
            for (let item of items) {
                let { id } = item;
                if (checked === true) {
                    if (idCheckedMap[id] === true) {
                        idCheckedMap[id] = false;
                    }
                }
                else {
                    if (idCheckedMap[id] === true) {
                        checked = true;
                    }
                }
            }
        }
        return idCheckedMap;
    }
}

export function useUqTag(uqTagProps: UqTagProps): UqTag {
    let { current: uqTag } = useRef(UqTag.create(uqTagProps));
    return uqTag;
}
