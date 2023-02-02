import { StoreBlogs } from 'app/stores';
import { marked } from 'marked';
import { useOutletContext, useParams } from 'react-router-dom';
import { Page } from "tonwa-com";

export function PageBlog() {
    const blogsStore = useOutletContext<StoreBlogs>();
    const { id } = useParams();
    let blog = blogsStore.items.find(v => v.id === Number(id));
    const { caption, content } = blog;
    return <Page header={caption}>
        <div className='p-3'>
            <div dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
        </div>
    </Page>;
}
