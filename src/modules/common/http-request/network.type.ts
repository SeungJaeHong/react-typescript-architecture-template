import { DocumentNode } from 'graphql';
import { AnyRecord, SerializableType } from '../types';

/**
 * file upload state
 */
export interface FileUploadStateArgs {
  /**
   * progress percentage
   * 0 ~ 100
   */
  progress: number;
  /**
   * uploaded bytes
   */
  loaded: number;
  /**
   * total bytes for uploading
   */
  total: number;
  /**
   * complete status
   */
  completed: boolean;
}

/**
 * file upload status via axios
 */
export interface AxiosFileUploadStateArgs {
  /**
   * uploaded bytes
   */
  loaded: number;
  /**
   * total bytes for uploading
   */
  total: number;
}

export interface HttpRequestErrorParser<T, E extends Error = Error> {
  parse(errorFromLibrary: T): E;
  throwError<E extends Error>(error: E): never;
  interrupt: <E extends Error>(error: E) => Promise<void>;
}

export interface AxiosHttpClient {
  get<T = SerializableType, D = AnyRecord | void>(
    uri: string,
    params?: D,
    timeout?: number
  ): Promise<T>;

  post<T = SerializableType, D = AnyRecord | void>(
    uri: string,
    body?: D,
    timeout?: number
  ): Promise<T>;

  put<T = SerializableType, D = AnyRecord | void>(
    uri: string,
    body?: D,
    timeout?: number
  ): Promise<T>;

  patch<T = SerializableType, D = AnyRecord | void>(
    uri: string,
    body?: D,
    timeout?: number
  ): Promise<T>;

  delete<T = SerializableType, D = AnyRecord | void>(
    uri: string,
    params?: D,
    timeout?: number
  ): Promise<T>;

  postUpload<
    T = void,
    D extends AnyRecord = Record<string, string | File | File[]>
  >(
    uri: string,
    data: D,
    progressCallback?: (args: FileUploadStateArgs) => void,
    timeout?: number
  ): Promise<T>;

  getFile<D = AnyRecord | void>(
    uri: string,
    params?: D,
    filename?: string
  ): Promise<File>;

  getBlob<D = AnyRecord | void>(uri: string, params?: D): Promise<Blob>;
}

// graphql-request의 type 참고
export type GQLVariables = {
  [key: string]: any;
};

// graphql-request의 type 참고
export type GQLRequestDocument = string | DocumentNode;
