import { IDataProvider, DataModel, KeyValueType } from 'underflag';
import axios, { AxiosRequestConfig } from 'axios';

interface HttpDataProviderOptions {
    /** Url to get a json object or an array of json object */
    url: string,
    /** Header authorization eg. 'Bearer ...' */
    token?: string
}

export class HttpDataProvider implements IDataProvider {
    private url: string;
    private token?: string;
    private data: DataModel[] = [];
    private initialized: boolean = false;

    constructor(options: HttpDataProviderOptions) {
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
        const { data: dataResult } = await axios.get<KeyValueType | KeyValueType[]>(this.url);

        if (dataResult instanceof Array) {
            this.data = (dataResult as KeyValueType[])
                .filter(a => a.key)
                .map(a => ({
                    key: a.key,
                    value: a.value,
                    description: a.description
                })) as DataModel[];
        } else {
            const keys = Object.keys(dataResult);
            this.data = keys.map(key => ({
                key,
                value: (dataResult as KeyValueType)[key]
            })) as DataModel[];
        }

        this.initialized = true;
        return this.data;
    }

    async get(key: string): Promise<DataModel | undefined> {
        if (!this.initialized) {
            await this.getAll()
        }
        const dataResult = this.data.find(a => a.key === key)
        if (!dataResult) return undefined;
        return dataResult as DataModel;
    }
}