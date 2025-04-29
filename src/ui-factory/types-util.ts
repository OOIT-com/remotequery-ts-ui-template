import { ActionParameters, TtDef } from './types';
import { isError, Result, SRecord, toSRecord } from 'remotequery-ts-common';
import { NavigationContextType } from './components/navigation/NavigationProvider';
import { TtDefFun } from '../app-support';

export const isTtDef = (arg: any): arg is TtDef => arg?.name && arg.uiType && arg.attributes && arg.actions;
export const isTtDefFun = (arg: any): arg is TtDefFun => arg && typeof arg === 'function';

export const resolveParameters = (parameters: ActionParameters = {}, context?: NavigationContextType): SRecord => {
  if (typeof parameters === 'function') {
    return context ? parameters(context) : {};
  } else {
    return toSRecord(parameters);
  }
};

export const toExceptionResult = (e: unknown): Result => ({ exception: isError(e) ? e.message : 'An error occurred' });
