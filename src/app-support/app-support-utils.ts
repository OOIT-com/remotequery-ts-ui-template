import moment from 'moment';
import { ExceptionResult, isError } from 'remotequery-ts-common';
import { dispatchLoading } from '../ui-factory';

export const isObject = (arg0: any): boolean => typeof arg0 === 'object';
export const isString = (arg0: any): boolean => typeof arg0 === 'string';
export const isNumber = (arg0: any): boolean => typeof arg0 === 'number';
export const isFunction = (arg0: any): boolean => typeof arg0 === 'function';
export const currentYear = (incr = 0) => (moment().year() + incr).toString();
export const currentMonth = () => moment().month();
export const currentIsoDate = () => moment().format('YYYY-MM-DD');
export const currentYearFirstDayIso = () => moment().year() + '-01-01';
export const currentYearLastDayIso = () => moment().year() + '-12-31';
export const mailFormatter2 = ({ value }: any) => {
  const arr = value.split('@');
  return arr[0] + (arr[1] ? ' (' + arr[1] + ')' : '');
};

export async function wrapLoading<T = any>(
  loading: string,
  promise: Promise<T> | (() => Promise<T>)
): Promise<T | ExceptionResult> {
  try {
    dispatchLoading(loading);
    if (typeof promise === 'function') {
      return await promise();
    } else {
      return await promise;
    }
  } catch (e) {
    if (isError(e)) {
      return { exception: e.message };
    }
    return { exception: 'Unknown Error' };
  } finally {
    dispatchLoading('');
  }
}

export function tryParseLocalStorage(name: string) {
  try {
    return JSON.parse(localStorage.getItem(name) || '');
  } catch (e) {
    if (isError(e)) {
      console.warn(e.message);
    }
  }
}
