import { StatusMessage } from './types';
import { isError } from 'remotequery-ts-common';

export const errorMessage = (
  userMessage: string,
  error: Error | string | unknown = '',
  additionalSystemMessages?: string[]
): StatusMessage => {
  const status = 'error';
  let systemMessage;
  if (!error) {
    systemMessage = '';
  } else if (isError(error)) {
    systemMessage = error.message;
  } else if (typeof error === 'string') {
    systemMessage = error;
  } else {
    systemMessage = error.toString();
  }
  return {
    status,
    userMessage,
    systemMessage,
    additionalSystemMessages
  };
};

export const warningMessage = (userMessage: string): StatusMessage => ({
  status: 'warning',
  userMessage: userMessage
});
export const infoMessage = (userMessage: string, systemMessage?: string): StatusMessage => ({
  status: 'info',
  userMessage: userMessage,
  systemMessage
});
export const successMessage = (userMessage: string): StatusMessage => ({
  status: 'success',
  userMessage: userMessage
});

export const isStatusMessage = (arg: any): arg is StatusMessage =>
  arg && typeof arg === 'object' && arg.status && arg.userMessage;
