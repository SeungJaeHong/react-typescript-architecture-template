import { isString, isArray, isObject } from './type-check.util';

const checkIsValidValue = <T>(value: T) => {
  if (value === undefined || value === null) {
    return false;
  }

  if (isString(value) && value.trim() === '') {
    return false;
  }

  return true;
};

const combineKeyValue = <T>(key: string, value: T) => {
  return `${key}=${value}`;
};

const combineQueryParams = <T>(params: T, itemKey?: string) => {
  const queries = Object.entries(params).reduce(
    (items: string[], [key, value]) => {
      if (!checkIsValidValue(value)) {
        return items;
      }

      if (isArray(value)) {
        items.push(combineQueryParams(value, key));
      } else {
        items.push(combineKeyValue(itemKey || key, encodeURIComponent(value)));
      }

      return items;
    },
    []
  );

  return queries.join('&');
};

export const toQueryString = <T>(params: T, withQuestionMark = false) => {
  if (!params || !isObject(params)) {
    return '';
  }

  return (withQuestionMark ? '?' : '') + combineQueryParams(params);
};
