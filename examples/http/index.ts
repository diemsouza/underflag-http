import { Underflag, isOn } from 'underflag';
import { HttpDataProvider } from '../../src/providers/HttpDataProvider';
import config from './config.json';

const print = async (underflag: Underflag, key: string) => {
    const data = await underflag.get(key);
    return {
        key,
        status: isOn(data) ? 'on' : 'off',
        value: data && data.value,
        origin: data && data.origin
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