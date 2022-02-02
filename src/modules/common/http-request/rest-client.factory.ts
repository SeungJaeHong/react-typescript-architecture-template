import axios, { AxiosError } from 'axios';
import { SerializableType, StringRecord, AnyRecord } from '../types';
import {
  HttpRequestErrorParser,
  AxiosHttpClient,
  FileUploadStateArgs,
} from './network.type';
import {
  createAxiosHeader,
  axiosResponseToData,
  axiosFileUploadCommon,
  errorThrowerForLibrary,
  convertToFormData,
} from './network.parser';
import { toQueryString } from '../utils';

export const createAxiosClient = (
  baseUrl: string,
  errorParser: HttpRequestErrorParser<AxiosError>,
  headerProvider: () => StringRecord = () => ({}),
  withCredentials = true,
  paramsSerializer: (params: any) => string = toQueryString
): AxiosHttpClient => {
  const axiosUploadCommon = axiosFileUploadCommon(
    baseUrl,
    errorParser,
    headerProvider,
    withCredentials
  );
  const axiosCatchCommon = errorThrowerForLibrary(errorParser);
  const exceptionHandler = errorParser.throwError;

  return {
    get<T = SerializableType, D = AnyRecord | void>(
      uri: string,
      params?: D,
      timeout?: number
    ): Promise<T> {
      try {
        const headers = createAxiosHeader(headerProvider);

        return axios
          .get<T>(baseUrl + uri, {
            headers,
            params,
            withCredentials,
            timeout,
            paramsSerializer,
          })
          .then(axiosResponseToData)
          .catch(axiosCatchCommon);
      } catch (error) {
        return Promise.reject(error).catch(exceptionHandler);
      }
    },

    post<T>(uri: string, data: any = null, timeout?: number): Promise<T> {
      try {
        const headers = createAxiosHeader(headerProvider);

        return axios
          .post<T>(baseUrl + uri, data, {
            headers,
            withCredentials,
            timeout,
          })
          .then(axiosResponseToData)
          .catch(axiosCatchCommon);
      } catch (error) {
        return Promise.reject(error).catch(exceptionHandler);
      }
    },

    put<T>(uri: string, data: any = null, timeout?: number): Promise<T> {
      try {
        const headers = createAxiosHeader(headerProvider);

        return axios
          .post<T>(baseUrl + uri, data, {
            headers,
            withCredentials,
            timeout,
          })
          .then(axiosResponseToData)
          .catch(axiosCatchCommon);
      } catch (error) {
        return Promise.reject(error).catch(exceptionHandler);
      }
    },

    patch<T>(uri: string, data: any = null, timeout?: number): Promise<T> {
      try {
        const headers = createAxiosHeader(headerProvider);

        return axios
          .post<T>(baseUrl + uri, data, {
            headers,
            withCredentials,
            timeout,
          })
          .then(axiosResponseToData)
          .catch(axiosCatchCommon);
      } catch (error) {
        return Promise.reject(error).catch(exceptionHandler);
      }
    },

    delete<T, D>(uri: string, params?: D, timeout?: number): Promise<T> {
      try {
        const headers = createAxiosHeader(headerProvider);

        return axios
          .delete<T>(baseUrl + uri, {
            headers,
            params,
            withCredentials,
            timeout,
            paramsSerializer,
          })
          .then(axiosResponseToData)
          .catch(axiosCatchCommon);
      } catch (error) {
        return Promise.reject(error).catch(exceptionHandler);
      }
    },

    getFile<D = AnyRecord | void>(
      url: string,
      params?: D,
      filename?: string
    ): Promise<File> {
      try {
        const headers = createAxiosHeader(headerProvider);

        return axios
          .get<Blob>(baseUrl + url, {
            headers,
            params,
            responseType: 'blob',
            withCredentials,
            paramsSerializer,
          })
          .then(axiosResponseToData)
          .then((blob) => new File([blob], filename || ''))
          .catch(axiosCatchCommon);
      } catch (error) {
        return Promise.reject(error).catch(exceptionHandler);
      }
    },

    getBlob<D = AnyRecord | void>(url: string, params?: D): Promise<Blob> {
      try {
        const headers = createAxiosHeader(headerProvider);

        return axios
          .get<Blob>(baseUrl + url, {
            headers,
            params,
            responseType: 'blob',
            withCredentials,
            paramsSerializer,
          })
          .then(axiosResponseToData)
          .catch(axiosCatchCommon);
      } catch (error) {
        return Promise.reject(error).catch(exceptionHandler);
      }
    },

    postUpload<
      T = void,
      D extends AnyRecord = Record<string, string | File | File[]>
    >(
      url: string,
      data: D,
      progressCallback?: (args: FileUploadStateArgs) => void,
      timeout?: number
    ): Promise<T> {
      return axiosUploadCommon(
        'post',
        url,
        convertToFormData(data),
        progressCallback,
        timeout
      );
    },
  };
};
