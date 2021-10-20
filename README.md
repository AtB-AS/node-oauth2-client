[![npm](https://img.shields.io/npm/v/@egomobile/oauth2-client.svg)](https://www.npmjs.com/package/@egomobile/oauth2-client)
[![last build](https://img.shields.io/github/workflow/status/egomobile/node-oauth2-client/Publish)](https://github.com/egomobile/node-oauth2-client/actions?query=workflow%3APublish)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/egomobile/node-oauth2-client/pulls)

# @egomobile/oauth2-client

> Creates and setups pre-configured [axios](https://github.com/axios/axios) clients, using OAuth 2.0 workflow(s)., written in [TypeScript](https://www.typescriptlang.org/).

## Install

Execute the following command from your project folder, where your `package.json` file is stored:

```bash
npm install --save @egomobile/oauth2-client
```

## Usage

```typescript
import createClientCredentialsClientFactory from "@egomobile/oauth2-client";

// create a factory function, that creates
// a pre-configured API client that already
// has an access_token, submitted as Bearer by default
export const createApiClient = createClientCredentialsClientFactory({
  // data for client authorization
  auth: {
    clientId: "foo",
    clientSecret: "bar",
  },

  // base URL of the API
  baseURL: "https://api.example.com",
  // URL to get the token
  tokenURL: "https://api.example.com/oauth2/token",

  // optional extra default headers
  headers: {
    "x-baz": "some value for an extra header",
  },

  // optional and additional / custom
  // axios configuration
  config: {
    // this always returns (true) by default
    validateStatus: (status) => status < 400,
  },
});

function doApiCall() {
  // create client with the new factory
  // without subitting the credentials
  // every time
  const client = await createClient();

  // now, do some API call with a pre-configured client
  // that submits the access_token as Bearer via
  // Authorization header
  return client.get("/foo?bar=baz"); // [GET] https://api.example.com/foo?bar=baz
}

const response = await doApiCall();
```

## Documentation

The API documentation can be found [here](https://egomobile.github.io/node-oauth2-client/).
