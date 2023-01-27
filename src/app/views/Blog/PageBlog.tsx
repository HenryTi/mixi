import { marked } from 'marked';
import { Page } from "tonwa-com";
import { Blog } from "uqs/BrMi";

export function PageBlog({ blog }: { blog: Blog }) {
    const { caption, content } = blog;
    return <Page header={caption}>
        <div className='p-3'>
            <div dangerouslySetInnerHTML={{ __html: marked(content) }}></div>
        </div>
    </Page>;
}
