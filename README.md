
# HTTP Provider

> ⚠️ This repository has been **archived** for visual organization on GitHub.  
> It is part of the [`underflag`](https://github.com/diemsouza/underflag) monorepo, where it's maintained and updated.  
> The package is still available on [NPM](https://www.npmjs.com/package/underflag-http).

This is a HTTP provider for underflag (feature flag/feature toggle) than help your app to load the features from a json object or an array of json object from web. You can get easly from the Github json file, AWS S3 or a Rest API with custom token too. 

## Install

Using npm:

```bash
npm install underflag underflag-http
```

Using yarn:

```bash
yarn add underflag underflag-http
```

## How to use

Import the underflag and prepare to load data provider

```js
import { Underflag } from "underflag";
import { HttpDataProvider } from "underflag-http";

const dataProvider = new HttpDataProvider({ 
    url: 'http://localhost:3000/features' 
});
const underflag = new Underflag({ dataProvider });
if (await underflag.isOn("feature")) {
    // ...
}
```

_Important: The url need return a json object or an array of json object_

Eg. json object: 
```json
{
    "feature": true
}
```

Eg. array of json object: 
```json
[
    {
        "key": "feature",
        "value": true
    }
]
```

If you need getting data from nested field like:
```json
{
    "data": [
        {
            "key": "feature",
            "value": true
        }
    ]
}
```

You can setting the path of the field:
```js
const dataProvider = new HttpDataProvider({
    url: 'http://localhost:3000/features',
    nestedField: 'data'
});
```

The nestedField option use lodash.get, know more about lodash.get on https://lodash.com/docs#get

Know more on [underflag npm page](https://www.npmjs.com/package/underflag)

### License

[MIT](LICENSE)
