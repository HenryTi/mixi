import { useParams } from "react-router-dom";
import { Page } from "tonwa-app";

interface PageIDEditProps {
    header: string;
}

export function PageIDEdit({ header }: PageIDEditProps) {
    const { id } = useParams();
    return <Page header={header}>
        id: {id}
    </Page>;
}
