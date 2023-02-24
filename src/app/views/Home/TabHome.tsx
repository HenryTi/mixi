import { ViewAccounts } from "app/views/accounts";
import { Link, useNavigate } from "react-router-dom";
import { FA, SearchBox, useT } from "tonwa-com";
import { Page } from 'tonwa-app';
import { appT, ResApp } from "../../res";
import { pathSearch } from "../Search";

export function TabHome() {
    let t = useT<ResApp>(appT);
    const navigate = useNavigate();
    async function onSearch(key: string) {
        navigate(pathSearch(), { state: { searchKey: key, } });
    }
    return <Page header={t(ResApp.home)} back="none">
        <div>
            <div className="px-3 py-4">
                <SearchBox className="mb-0" onSearch={onSearch} placeholder="股票代码，名称" />
            </div>
            <Link to="/blogs" className="d-flex my-2 cursor-pointer bg-white"
            >
                <FA name="envelope-o" className="text-info align-self-center ms-3 ms-sm-3" size="lg" fixWidth={true} />
                <div className="px-2 px-sm-3">
                    米投博客
                </div>
            </Link>
        </div>
        <div className="h-1c" />

        <ViewAccounts />
    </Page>
}
