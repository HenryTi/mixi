import { BlogsStore } from "app/stores";
import { EasyTime, FA, List, LMR, Page, useNav } from "tonwa-com";
import { usePageStoreInit } from "tonwa-uq-com";
import { Blog } from "uqs/BrMi";
import { PageBlog } from "./PageBlog";
import { PagePrinciple } from "./PagePrinciple";

export function PageBlogs() {
    const blogsStore = usePageStoreInit<BlogsStore>(() => new BlogsStore());
    const blogs: Blog[] = blogsStore.items;
    const nav = useNav();
    function BlogItemView({ value }: { value: Blog }) {
        let { caption } = value;
        return <LMR className="px-3 py-2">
            <IconBlog />
            <span>{caption}</span>
            <small className="text-muted"><EasyTime date={(value as any).$create} /></small>
        </LMR>;
    }

    function onClickBlog(blog: Blog) {
        return nav.open(< PageBlog blog={blog} />);
    }

    function onAbout() {
        alert('show me');
    }

    function onBlogs() {
        nav.open(<PagePrinciple />);
    }
    function Icon({ icon }: { icon: string; }) {
        return <FA name={icon} className="text-info align-self-center me-3 me-sm-3" size="lg" fixWidth={true} />
    }
    function IconBlog() {
        return <Icon icon="file-o" />
    }
    return <Page header="米投博客">
        <div className="pb-3">
            <div className="d-flex px-3 my-2 cursor-pointer bg-white fw-bold text-primary"
                onClick={onBlogs}>
                <IconBlog />
                <span>米投原则</span>
            </div>
            <List items={blogs} className="border-bottom"
                ItemView={BlogItemView}
                onItemClick={onClickBlog} />
        </div>
    </Page>
}
