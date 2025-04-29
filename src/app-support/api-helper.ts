import { PRecord, Result, SRecord } from 'remotequery-ts-common';

export const API_BASE = process.env.REACT_APP_API_BASE;
export const API_REQUEST_SINGLE = `${API_BASE}remoteQuery`;
const FORM_TYPE = 'application/x-www-form-urlencoded; charset=UTF-8';

let sessionId = '';

export const getSessionId = () => sessionId;
export const setSessionId = (sid: string) => (sessionId = sid);

export async function callServiceQuery(serviceId: string, parameters: PRecord): Promise<any> {
  const url = API_REQUEST_SINGLE + '/' + serviceId;
  const apiUrl = new URL(url, window.location.href);
  parameters = { ...parameters, sessionId };
  const fetchOptions: any = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': FORM_TYPE
    }),
    body: encodeBody(parameters)
  };
  if (apiUrl.origin !== window.location.origin) {
    // not same origin
    // fetchOptions.credentials = 'include';
  }

  const controller = new AbortController();
  fetchOptions.signal = controller.signal;

  return fetch(url, fetchOptions)
    .then((resp) => {
      if (resp.status !== 200) {
        return { exception: `Unexpected status ${resp.status} : ${resp.statusText} (url ${url})` };
      }
      if (typeof resp.json === 'function') {
        return resp.json().then((json) => {
          if (json.exception === 'NOSESSION') {
            window.location.reload();
          }
          return json;
        });
      } else {
        return { exception: `Missing json function when calling ${url}.` };
      }
    })
    .catch((err) => {
      return { exception: err.message };
    });
}

function encodeBody(parameters: PRecord) {
  return Object.keys(parameters)
    .map((property) => {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(parameters[property]);
      return encodedKey + '=' + encodedValue;
    })
    .join('&');
}

export function uploadFile(
  file: File | (Blob & { name: string }),
  serviceId: string,
  parameters: SRecord = {}
): Promise<Result> {
  const url = API_REQUEST_SINGLE + '/' + serviceId;
  const formData = new FormData();
  formData.append(file.name, file);
  const apiUrl = new URL(url, window.location.href);
  Object.keys(parameters).forEach((key) => formData.append(key, parameters[key].toString()));
  formData.append('sessionId', getSessionId());

  const fetchOptions: any = {
    method: 'POST',
    body: formData
  };
  if (apiUrl.origin !== window.location.origin) {
    // not same origin
    // fetchOptions.credentials = 'include';
  }

  return fetch(url, fetchOptions)
    .then((resp) => resp.json())
    .then((resp) => resp)
    .catch((err) => {
      return { exception: err.message };
    });
}
