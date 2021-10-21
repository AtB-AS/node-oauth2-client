/* eslint-disable unicorn/filename-case */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */

// This file is part of the @egomobile/oauth2-client distribution.
// Copyright (c) Next.e.GO Mobile SE, Aachen, Germany (https://e-go-mobile.com/)
//
// @egomobile/oauth2-client is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation, version 3.
//
// @egomobile/oauth2-client is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
import { URLSearchParams } from 'url';
import { returnTrue } from '../constants';
import type { AxiosFactory, NewAxiosClientConfig, Nilable } from '../types';

/**
 * Options for 'createClientCredentialsClient()' and
 * 'createClientCredentialsClientFactory' functions.
 */
export interface ICreateClientCredentialsClientOptions {
    /**
     * OAuth 2.0 Auth information.
     */
    auth: {
        /**
         * The ID of the client.
         */
        clientId: string;
        /**
         * The secret of the client.
         */
        clientSecret: string;
    };
    /**
     * The base URL of the underlying API.
     */
    baseURL?: Nilable<string>;
    /**
     * The custom configuration for a new axios client.
     */
    config?: Nilable<NewAxiosClientConfig>;
    /**
     * Optional and custom headers.
     */
    headers?: Nilable<AxiosRequestHeaders>;
    /**
     * The optional scope, if required.
     */
    scope?: Nilable<string>;
    /**
     * The URL from where to get the access token.
     */
    tokenURL: string;
}

/**
 * Creates a new pre-configured axios instance, that first gets
 * an access token via an OAuth 2.0 workflow of type 'client_credentials'.
 *
 * @example
 * ```
 * import { createClientCredentialsClient } from '@egomobile/oauth2-client'
 *
 * const client = await createClientCredentialsClient({
 *   // data for client authorization
 *   auth: {
 *     clientId: 'foo',
 *     clientSecret: 'bar'
 *   },
 *
 *   // base URL of the API
 *   baseURL: 'https://api.example.com',
 *   // URL from where to get the token from
 *   tokenURL: 'https://api.example.com/oauth2/token',
 *
 *   // optional extra default headers
 *   headers: {
 *     'x-baz': 'some value for an extra header'
 *   },
 *
 *   // optional and additional / custom
 *   // axios configuration
 *   config: {
 *     // this always returns (true) by default
 *     validateStatus: (status) => status < 400,
 *   }
 * })
 *
 * // now, do some API call with a pre-configured client
 * // that submits the access_token as Bearer via
 * // Authorization header
 * await client.get('/foo?bar=baz')  // [GET] https://api.example.com/foo?bar=baz
 * ```
 *
 * @param {ICreateClientCredentialsClientOptions} options For the
 *
 * @returns {Promise<AxiosInstance>} The promise with the new client.
 */
export async function createClientCredentialsClient(
    options: ICreateClientCredentialsClientOptions
): Promise<AxiosInstance> {
    const { auth, baseURL, config, headers, scope, tokenURL } = options;
    const { clientId, clientSecret } = auth;

    if (baseURL) {
        if (typeof baseURL !== 'string') {
            throw new TypeError('baseURL must be of type string');
        }
    }

    if (typeof clientId !== 'string') {
        throw new TypeError('clientId must be of type string');
    }

    if (typeof clientSecret !== 'string') {
        throw new TypeError('clientSecret must be of type string');
    }

    if (scope) {
        if (typeof scope !== 'string') {
            throw new TypeError('scope must be of type string');
        }
    }

    if (typeof tokenURL !== 'string') {
        throw new TypeError('tokenURL must be of type string');
    }

    const requestBody = new URLSearchParams();
    requestBody.set('grant_type', 'client_credentials');
    requestBody.set('client_id', clientId);
    requestBody.set('client_secret', clientSecret);

    if (scope?.length) {
        requestBody.set('scope', scope);
    }

    const response = await axios.post<any>(
        tokenURL,
        requestBody.toString()
    );

    if (typeof response.data !== 'object') {
        throw new TypeError(`Unexpected response data: ${response.data}`);
    }

    const access_token = response.data.access_token;
    if (typeof access_token !== 'string') {
        throw new TypeError(`Unexpected type of access_token: ${access_token}`);
    }

    if (String(response.data.token_type).toLowerCase().trim() !== 'bearer') {
        throw new TypeError('Only token_type bearer is supported');
    }

    return axios.create({
        baseURL: baseURL || undefined,
        headers: {
            Authorization: `Bearer ${access_token}`,
            ...(headers || {})
        },
        validateStatus: returnTrue,
        ...(config || {})
    });
}

/**
 * Creates a factory function, which always creates a new pre-configured axios instance,
 * that first gets an access token via an OAuth 2.0 workflow of type 'client_credentials'.
 *
 * @example
 * ```
 * import createClientCredentialsClientFactory from '@egomobile/oauth2-client'
 *
 * const createClient = createClientCredentialsClientFactory({
 *   // data for client authorization
 *   auth: {
 *     clientId: 'foo',
 *     clientSecret: 'bar'
 *   },
 *
 *   // base URL of the API
 *   baseURL: 'https://api.example.com',
 *   // URL from where to get the token from
 *   tokenURL: 'https://api.example.com/oauth2/token',
 *
 *   // optional extra default headers
 *   headers: {
 *     'x-baz': 'some value for an extra header'
 *   },
 *
 *   // optional and additional / custom
 *   // axios configuration
 *   config: {
 *     // this always returns (true) by default
 *     validateStatus: (status) => status < 400,
 *   }
 * })
 *
 * function doApiCall() {
 *   // create client with the new factory
 *   // without subitting the credentials
 *   // every time
 *   const client = await createClient()
 *
 *   // now, do some API call with a pre-configured client
 *   // that submits the access_token as Bearer via
 *   // Authorization header
 *   return client.get('/foo?bar=baz')  // [GET] https://api.example.com/foo?bar=baz
 * }
 *
 * const response = await doApiCall()
 * ```
 *
 * @param {ICreateClientCredentialsClientOptions} options For the
 *
 * @returns {AxiosFactory} The new factory.
 */
export function createClientCredentialsClientFactory(options: ICreateClientCredentialsClientOptions): AxiosFactory {
    return () => createClientCredentialsClient(options);
}
