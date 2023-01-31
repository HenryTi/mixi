import { FA, useNav } from "tonwa-com";
import { User } from "tonwa-uq";
import { SelectUser } from "../coms";
import { roleT } from "./res";

interface Props {
    onUserAdded: (userId: number) => Promise<void>;
}
export function ButtonAddUser({ onUserAdded }: Props) {
    let nav = useNav();
    async function onAddUser() {
        let top = <div className="my-3">{roleT('searchUser')}</div>;
        let ret = await nav.call<User>(<SelectUser header={roleT('user')} top={top} />);
        await onUserAdded(ret.id);
        nav.close(0);
    }
    return <button className="btn btn-sm btn-link" onClick={onAddUser}><FA name="plus" className="me-1" />{roleT('new')}</button>
}
