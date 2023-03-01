import { useParams } from "react-router-dom";
import { Page } from "tonwa-app";

export function PageProductEdit() {
    const { id } = useParams();
    return <Page header="编辑产品">
        id: {id}
    </Page>;
}
