import { CallApi } from './types';
import { PRecord, Result, toResult, toSRecord } from 'remotequery-ts-common';

import { toExceptionResult } from './types-util';

const dummyCallApi = async (serviceId: string, parameters: Record<string, string | number | boolean>) => {
  return {
    exception: `Exception: dummyCallApi called ${serviceId}, parameters ${
      parameters ? JSON.stringify(parameters) : 'no-parameter'
    }`
  };
};
let _callApi: CallApi = dummyCallApi;
export const setCallApi = (callApi: CallApi) => {
  _callApi = callApi;
};

export async function processService(serviceId: string, parameters?: PRecord): Promise<Result> {
  if (serviceId) {
    try {
      return await _callApi(serviceId, parameters || {});
    } catch (e) {
      return toExceptionResult(e);
    }
  }
  if (parameters) {
    return toResult([toSRecord(parameters)]);
  } else {
    return { exception: 'Missing serviceId!' };
  }
}
