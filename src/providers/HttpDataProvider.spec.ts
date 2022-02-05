import { Underflag, IDataProvider } from 'underflag';
import { HttpDataProvider } from '.'
import axios from "axios";

jest.mock("axios");

describe('Data Provider', () => {
    describe('Json', () => {

        let dataProvider: IDataProvider;
        let underflag: Underflag;

        beforeEach(() => {
            dataProvider = new HttpDataProvider({ url: "http://localhost:3000" });
            underflag = new Underflag({ dataProvider });
        });

        test('should return feature test_a on', async () => {
            (axios.get as jest.Mock).mockImplementation(() => Promise.resolve({ data: { test_a: true } }));
            await expect(underflag.isOn('test_a')).resolves.toBeTruthy();
        });

        test('should return feature test_b off', async () => {
            (axios.get as jest.Mock).mockImplementation(() => Promise.resolve({ data: { test_a: false } }));
            await expect(underflag.isOff('test_b')).resolves.toBeTruthy();
        });

        test('should return two features', async () => {
            (axios.get as jest.Mock).mockImplementation(() => Promise.resolve({ data: { "test_a": true, "test_b": false } }));
            const res = await underflag.getAll();
            expect(res).toBeInstanceOf(Array);
            expect(res.length).toEqual(2);
            expect(res[0].value).toBeTruthy();
            expect(res[1].value).toBeFalsy();
        });
    });
});