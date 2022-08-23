import { IDataProvider, BaseFeature, JSONData, JSONObject } from 'underflag';
import axios, { AxiosRequestConfig } from 'axios';
import getValue from 'lodash.get';

interface HttpDataProviderOptions {
    /** Url to get a json object or an array of json object */
    url: string,
    /** Header authorization eg. 'Bearer ...' */
    token?: string,
    /** Path of nested data */
    nestedField?: string
}

export class HttpDataProvider implements IDataProvider {
    private url: string;
    private token?: string;
    private data: BaseFeature[] = [];
    private initialized: boolean = false;
    private nestedField?: string;

    constructor(options: HttpDataProviderOptions) {
        this.url = options.url;
        this.token = options.token;
        this.nestedField = options.nestedField;
        const config: AxiosRequestConfig | undefined = {}
        if (this.token) {
            config.headers = {
                'Authorization': this.token
            }
        }
    }

    async getAll(): Promise<BaseFeature[]> {
        const { data: dataResult } = await axios.get<JSONData>(this.url);
        const _dataResult: JSONData = this.nestedField ? getValue(dataResult, this.nestedField) : dataResult;
        if (_dataResult instanceof Array) {
            this.data = (_dataResult as JSONObject[])
                .filter(a => a.key)
                .map(a => ({
                    key: a.key,
                    value: a.value,
                    description: a.description
                })) as BaseFeature[];
        } else {
            const keys = Object.keys(_dataResult);
            this.data = keys.map(key => ({
                key,
                value: (_dataResult as JSONObject)[key]
            })) as BaseFeature[];
        }

        this.initialized = true;
        return this.data;
    }

    async get(key: string): Promise<BaseFeature | undefined> {
        if (!this.initialized) {
            await this.getAll()
        }
        const dataResult = this.data.find(a => a.key === key)
        if (!dataResult) return undefined;
        return dataResult as BaseFeature;
    }
}