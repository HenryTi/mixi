import { ViewAccounts } from "app/accounts";
import { useForm } from "react-hook-form";
import { FA, Page, SearchBox, useNav, useT } from "tonwa-com";
import { appT } from "../../res";
import { PageBlogs } from "../Blog";
import { PageSearch } from "../Search";

export function TabHome() {
    let t = useT(appT);
    const nav = useNav();
    function onBlogs() {
        nav.open(<PageBlogs />);
    }
    async function onSearch(key: string) {
        nav.open(<PageSearch searchKey={key} markets={undefined} />);
    }
    return <Page header={t('home')}>
        <div>
            <div className="px-3 py-4">
                <SearchBox className="mb-0" onSearch={onSearch} placeholder="股票代码，名称" />
            </div>
            <div className="d-flex my-2 cursor-pointer bg-white"
                onClick={onBlogs}>
                <FA name="envelope-o" className="text-info align-self-center ms-3 ms-sm-3" size="lg" fixWidth={true} />
                <div className="px-2 px-sm-3">
                    米投博客
                </div>
            </div>
        </div>
        <div className="h-1c" />

        <ViewAccounts />
    </Page>
}
