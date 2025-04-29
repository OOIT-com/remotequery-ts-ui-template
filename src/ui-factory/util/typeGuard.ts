import { SRecord } from 'remotequery-ts-common';

export const isSRecord = (data: unknown): data is SRecord => typeof data === 'object';
