import { IDataProvider, DataModel, ValueType } from 'underflag';
import axios, { AxiosRequestConfig } from 'axios';

type KeyValue = { [x: string]: ValueType | KeyValue }

interface Options {
    /** Url to get a json object or an array of json object */
    url: string,
    /** Header authorization eg. 'Bearer ...' */
    token?: string
}

export class HttpDataProvider implements IDataProvider {
    private url: string;
    private token?: string;
    private list: DataModel[] | undefined = undefined;

    constructor(options: Options) {
        this.url = options.url;
        this.token = options.token;
        const config: AxiosRequestConfig | undefined = {}
        if (this.token) {
            config.headers = {
                'Authorization': this.token
            }
        }
    }

    async getAll(): Promise<DataModel[]> {
        const dataResult = await axios.get<KeyValue | DataModel[]>(this.url);
        if (dataResult.data instanceof Array) {
            this.list = dataResult.data as DataModel[];
        }
        const _data = dataResult.data as KeyValue;
        const keys = Object.keys(_data);
        if (!keys.length) return [];
        this.list = [];
        keys.forEach(key => {
            this.list?.push({ key, value: _data[key] })
        })
        return this.list !== undefined ? this.list : [];
    }

    async get(key: string): Promise<DataModel | undefined> {
        if (this.list === undefined) {
            await this.getAll()
        }
        const dataResult = this.list?.find(a => a.key === key)
        if (!dataResult) return undefined;
        return dataResult as DataModel;
    }
}