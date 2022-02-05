
# HTTP Provider

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

const dataProvider = new HttpDataProvider({ url: 'http://localhost:3000/features' });
const underflag = new Underflag({ dataProvider });
if (await underflag.isOn("feature")) {
    // ...
}
```

_Important: The url need return a json object or an array of json object_

Eg. json object: 
```
{
    "feature": true
}
```

Eg. array of json object: 
```
[
    {
        "key": "feature",
        "value": true
    }
]
```

Know more on [underflag npm page](https://www.npmjs.com/package/underflag)

### License

[MIT](LICENSE)