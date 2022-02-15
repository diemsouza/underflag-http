import { Underflag } from 'underflag';
import { HttpDataProvider } from '../../src/providers/HttpDataProvider';
import config from './config.json';

const print = async (underflag: Underflag, key: string) => {
    const data = await underflag.getFeature(key);
    return {
        key,
        status: data?.isOn() ? 'on' : 'off',
        value: data?.value,
        origin: data?.origin
    };
};

(async () => {
    // use data privider
    const dataProvider = new HttpDataProvider({ url: config.url });
    const underflag = new Underflag({ dataProvider });

    // check feature flags
    const list: any[] = [];
    for (const key of config.features) {
        list.push(await print(underflag, key));
    }
    list.push(await print(underflag, 'other'));
    console.table(list);
})();