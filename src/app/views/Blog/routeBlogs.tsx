import { useUqApp } from "app/MyUqApp";
import { StoreBlogs } from "app/stores";
import { useQuery } from "react-query";
import { Outlet, Route } from "react-router-dom";
import { PageBlog } from "./PageBlog";
import { PageBlogs } from "./PageBlogs";
import { PagePrinciple } from "./PagePrinciple";

function LayoutBlogs() {
    let uqApp = useUqApp();
    let { data: blogsStore } = useQuery('LayoutBlogs', async function () {
        let ret = new StoreBlogs();
        ret.setUqAppAndParent(uqApp, undefined);
        await ret.initOnce();
        return ret;
    });
    return <div>
        <Outlet context={blogsStore} />
    </div>;
}

export const routeBlogs = <Route path="/blogs" element={<LayoutBlogs />}>
    <Route index element={<PageBlogs />} />
    <Route path="blog/:id" element={<PageBlog />} />
    <Route path="principle" element={<PagePrinciple />} />
</Route>;
