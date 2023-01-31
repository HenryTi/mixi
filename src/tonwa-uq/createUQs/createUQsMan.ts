import { Net } from "../net";
import { UqConfig } from "../tool";
import { UQsLoader, UQsMan } from "../uqCore";

export async function createUQsMan(net: Net, appVersion: string, uqConfigs: UqConfig[], uqsSchema: { [uq: string]: any; }): Promise<UQsMan> {
    let uqsLoader = new UQsLoader(net, appVersion, uqConfigs, uqsSchema);

    let initErrors = await uqsLoader.build();
    if (initErrors) {
        console.error(initErrors);
        throw initErrors;
    }
    return uqsLoader.uqsMan;
}
