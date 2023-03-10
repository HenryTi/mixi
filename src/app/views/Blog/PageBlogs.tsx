import { StoreBlogs } from "app/stores";
import { Link, useOutletContext } from "react-router-dom";
import { EasyTime, FA, List, LMR } from "tonwa-com";
import { Page } from 'tonwa-app';
import { Blog } from "uqs/BrMi";

export function PageBlogs() {
    const blogsStore = useOutletContext<StoreBlogs>();
    let blogs: Blog[] = blogsStore.items;
    function BlogItemView({ value }: { value: Blog }) {
        let { caption } = value;
        return <LMR className="px-3 py-2">
            <IconBlog />
            <span>{caption}</span>
            <small className="text-muted"><EasyTime date={(value as any).$create} /></small>
        </LMR>;
    }
    const Icon = ({ icon }: { icon: string; }) =>
        <FA name={icon} className="text-info align-self-center me-3 me-sm-3" size="lg" fixWidth={true} />;
    const IconBlog = () => <Icon icon="file-o" />;
    return <Page header="米投博客" footer={<div className="text-center py-1">米投博客</div>}>
        <div className="pb-3">
            <Link className="d-flex px-3 my-2 cursor-pointer bg-white fw-bold text-primary"
                to="principle">
                <IconBlog />
                <span>米投原则</span>
            </Link>
            <List items={blogs} className="border-bottom"
                ViewItem={BlogItemView}
                onItemClick={blog => 'blog/' + blog.id} />
        </div>
    </Page>
}
