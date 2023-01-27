import { useCallback } from "react";
import { ID } from "tonwa-uq";
import { useBand, useBandContainer, usePromise, Band, BandProps, CharInputBase } from "tonwa-com";

interface Props {
    name: string;
    ID: ID;
    editable?: boolean;
}

export function IDNOInput({ name, ID, editable }: Props) {
    let band = useBand();
    let bandContainer = useBandContainer();
    let getNO = useCallback(async function () {
        if (!band) return;
        if (!bandContainer) return;
        let ret = (bandContainer?.props?.values?.[name]);
        if (ret !== undefined) return ret;
        ret = await ID.NO();
        bandContainer.setValue(name, ret);
        return ret;
    }, [band, bandContainer, name, ID]);
    let no = usePromise(getNO);
    return <CharInputBase name={name} placeholder="" maxLength={20} readOnly={!editable === true} initValue={no} />;
}

export function BandIDNOInput(props: BandProps & Props) {
    return <Band {...props}>
        <IDNOInput {...props} />
    </Band>;
}
