import axios, {
  AxiosError,
  AxiosResponse,
  AxiosRequestHeaders,
  Method,
} from 'axios';
import { StringRecord } from '../types';
import {
  HttpRequestErrorParser,
  FileUploadStateArgs,
  AxiosFileUploadStateArgs,
} from './network.type';

export const axiosResponseToData = <T>(response: AxiosResponse<T>) =>
  response.data;

export const createAxiosHeader = (headerProvider: () => AxiosRequestHeaders) =>
  headerProvider();

export const errorThrowerForLibrary =
  <T>(errorParser: HttpRequestErrorParser<T>) =>
  (anyError: any): never => {
    const newError = errorParser.parse(anyError);

    return errorParser.interrupt(newError).then(() => {
      throw newError;
    }) as never;
  };

export const graphqlErrorResponseToData =
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interrupt?: (error: any) => Promise<void>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) =>
  (err: any) => {
    if (interrupt) {
      interrupt(err);
    }
    throw err;
  };

export const axiosFileUploadCommon =
  (
    baseUrl: string,
    errorParser: HttpRequestErrorParser<AxiosError>,
    headerProvider: () => StringRecord,
    withCredentials = true
  ) =>
  <T>(
    method: Method,
    uri: string,
    data: FormData,
    progressCallback?: (args: FileUploadStateArgs) => void,
    timeout?: number
  ) => {
    try {
      const headers = createAxiosHeader(headerProvider);
      const axiosCatchCommon = errorThrowerForLibrary(errorParser);

      return axios(baseUrl + uri, {
        method,
        headers,
        data,
        onUploadProgress: ({ loaded, total }: AxiosFileUploadStateArgs) => {
          const args = {
            progress: Math.floor((loaded * 1000) / total) / 10,
            loaded,
            total,
            completed: loaded >= total,
          };

          if (progressCallback) {
            progressCallback(args);
          }
        },
        withCredentials,
        timeout,
      })
        .then<T>(axiosResponseToData)
        .catch(axiosCatchCommon);
    } catch (error) {
      return Promise.reject(error);
    }
  };

export const convertToFormData = (
  data: Record<string, string | File | File[]>
) => {
  const formData = new FormData();
  const keys = Object.keys(data);
  let key = '';

  for (let i = 0; i < keys.length; i++) {
    key = keys[i];

    if (!Object.prototype.hasOwnProperty.call(data, key)) {
      continue;
    }
    const value = data[key];

    if (Array.isArray(value)) {
      const len = value.length;
      for (let idx = 0; idx < len; idx++) {
        const file: File = value[idx];
        formData.append(key, file, file.name);
      }
    } else {
      formData.set(key, value);
    }
  }

  return formData;
};
