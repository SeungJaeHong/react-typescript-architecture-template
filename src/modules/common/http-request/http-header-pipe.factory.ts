import { StringRecord } from '../types';

type TokenProvider = any;

/**
 * Accept: 'application/json' 추가
 * @param headers 헤더 데이터
 */
const acceptApplicationJson = (headers: StringRecord) => {
  headers['Accept'] = 'application/json';
  return headers;
};

/**
 * Content-Type: 'application/x-www-form-urlencoded' 추가
 * @param headers 헤더 데이터
 */
const contentTypeFormData = (headers: StringRecord) => {
  headers['Content-Type'] = 'application/x-www-form-urlencoded';
  return headers;
};

/**
 * Content-Type: 'multipart/form-data' 추가
 * @param headers 헤더 데이터
 */
const contentTypeMultipartFormData = (headers: StringRecord) => {
  headers['Content-Type'] = 'multipart/form-data';
  return headers;
};

/**
 * Content-Type: 'multipart/form-data' 추가
 * @param headers 헤더 데이터
 */
const authorizationBearerToken = (headers: StringRecord, token?: string) => {
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const headerPipes = {
  acceptApplicationJson,
  contentTypeFormData,
  contentTypeMultipartFormData,
  authorizationBearerToken,
};

type HeaderPipes = Array<
  (headers: StringRecord, token?: string) => StringRecord
>;

export const createHttpHeaders =
  (tokenProvider: TokenProvider) =>
  (...pipes: HeaderPipes) => {
    let token = '';
    if (tokenProvider) {
      token = tokenProvider.get();

      if (!token) {
        throw new Error('로그인이 필요한 서비스입니다.');
      }
    }

    return pipes.reduce(
      (headers, pipe) => pipe(headers, token),
      {}
    ) as StringRecord;
  };
