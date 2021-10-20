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

import type { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * A function that provides an axios instance.
 */
export type AxiosFactory = () => Promise<AxiosInstance>;

// preparations for NewAxiosClientConfig
type NewAxiosClientConfig1 = Omit<AxiosRequestConfig<any>, 'headers'>;
type NewAxiosClientConfig2 = Omit<NewAxiosClientConfig1, 'baseURL'>;
/**
 * Configuration for a new axios client.
 */
export type NewAxiosClientConfig = NewAxiosClientConfig2;

/**
 * A type that can be (null) or (undefined).
 */
export type Nilable<T extends any = any> = Nullable<T> | Optional<T>;

/**
 * A type that can also be (null).
 */
export type Nullable<T extends any = any> = T | null;

/**
 * A type that can also be (undefined).
 */
export type Optional<T extends any = any> = T | undefined;
