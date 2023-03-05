import { MGroup, MiGroup } from "app/stores/MGroup";
import { MGroups, MiGroups } from "app/stores/MGroups";
import { FA, List } from "tonwa-com";

const pos = { right: "-1.0rem", bottom: "-0.3rem" };

interface ViewGroupsProps<T extends MGroup> {
    miGroups: MGroups<T>;
    onGroupClick: (group: MGroup) => void;
}

export function ViewGroups<T extends MGroup>({ miGroups, onGroupClick }: ViewGroupsProps<T>) {
    return <List items={miGroups.groups}
        ViewItem={ItemViewGroup}
        onItemClick={onGroupClick}
        className="d-flex flex-wrap bg-white p-1" />;

    function ItemViewGroup({ value }: { value: MGroup }) {
        let { name, count, type } = value;
        let left: any;
        switch (type) {
            default:
            case 'group':
                left = <FA name="list-alt" className="text-info align-self-center" />;
                break;
            case 'industry':
                left = <FA name="leaf" className="text-danger align-self-center" />;
                break;
        }
        let fontStyle: React.CSSProperties;
        let len = name.length;
        if (len >= 9) fontStyle = { fontSize: '50%' };
        if (len >= 8) fontStyle = { fontSize: '60%' };
        else if (len >= 7) fontStyle = { fontSize: '70%' };
        else if (len >= 6) fontStyle = { fontSize: '80%' };
        let right = count > 0 && <small className="text-muted position-absolute" style={pos}>{count}</small>;
        return <div className="d-block w-min-6c w-max-6c text-center py-1 m-1 border rounded bg-white">
            <span className="position-relative">
                {left} {right}
            </span>
            <div className="" style={fontStyle}>{name}</div>
        </div>;
    }
}
