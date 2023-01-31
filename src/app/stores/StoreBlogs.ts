import { MyPageStore } from "app/MyPageStore";
import { BrMi } from "uqs";
import { Blog } from "uqs/BrMi";

export class StoreBlogs extends MyPageStore {
    yumi: BrMi.UqExt;
    items: Blog[];

    async init() {
        const yumi = this.uqs.BrMi;
        let pageStart = 0;
        let pageSize = 100;
        let ret = await yumi.ID<Blog>({
            IDX: yumi.Blog,
            id: undefined,
            order: 'desc',
            page: { start: pageStart, size: pageSize },
        });
        this.items = ret; //  { $page: ret };
    }
}
/*
export class BlogPageItems extends PageItems<Blog> {
    private yumi: BrMi.UqExt;

    constructor(yumi: BrMi.UqExt) {
        super(false);
        this.yumi = yumi;
        this.firstSize = 30;
        this.pageSize = 10;
    }

    protected getPageId(item: Blog): any {
        return item?.id;
    }

    protected async loadResults(param: undefined, pageStart: any, pageSize: number): Promise<{ [name: string]: any[] }> {
        let ret = await this.yumi.ID<Blog>({
            IDX: this.yumi.Blog,
            id: undefined,
            order: 'desc',
            page: { start: pageStart, size: pageSize },
        });
        return { $page: ret };
    }
}
*/
