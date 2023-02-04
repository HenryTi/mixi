import { StoreBlogs } from "app/stores";
import { useQuery } from "react-query";
import { Outlet, Route } from "react-router-dom";
import { PageBlog } from "./PageBlog";
import { PageBlogs } from "./PageBlogs";
import { PagePrinciple } from "./PagePrinciple";

function OutletBlogs() {
    let { data: blogsStore } = useQuery('LayoutBlogs', async function () {
        let ret = new StoreBlogs();
        await ret.init();
        return ret;
    });
    return <Outlet context={blogsStore} />;
}

export const routeBlogs = <Route path="/blogs" element={<OutletBlogs />}>
    <Route index element={<PageBlogs />} />
    <Route path="blog/:id" element={<PageBlog />} />
    <Route path="principle" element={<PagePrinciple />} />
</Route>;
