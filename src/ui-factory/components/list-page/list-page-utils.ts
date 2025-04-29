import { ActionDef, ServiceDataSetter, TtDef } from '../../types';
import { SRecord, toFirst } from 'remotequery-ts-common';
import { dispatchException, dispatchLoading } from '../../redux';
import { processAction } from '../../tabletool-utils';
import { processForward } from '../navigation/process-forward';
import { NavigationContextType } from '../navigation/NavigationProvider';

const resizeModePrefix = '__list_page_resizeMode_';
const filterModelPrefix = '__list_page_filtermodel_';
const paginationSizePrefix = '__list_page_pagination_size_';

export type ResizeMode = 'sizeToFit' | 'autoSizeAll';

export const saveResizeMode = (resizeMode: ResizeMode, key: string) => {
  const k = `${resizeModePrefix}${key}`;
  localStorage.setItem(k, resizeMode);
};

export const getResizeMode = (key: string): ResizeMode => {
  const k = `${resizeModePrefix}${key}`;
  return (localStorage.getItem(k) as ResizeMode) || 'sizeToFit';
};
export const savedFilterModel = (key: string, filterModel: any) =>
  filterModel && localStorage.setItem(`${filterModelPrefix}${key}`, JSON.stringify(filterModel));

export const savePaginationSize = (paginationSize: number, key: string) =>
  localStorage.setItem(`${paginationSizePrefix}${key}`, paginationSize.toString());

export const getPaginationSize = (key: string): number => {
  const s = localStorage.getItem(`${paginationSizePrefix}${key}`);
  return +(s ?? '100') || 100;
};

export const getFilterModel = (key: string): any => {
  const json = localStorage.getItem(`${filterModelPrefix}${key}`);
  if (json) {
    return JSON.parse(json);
  }
};

export async function processToolbarAction(
  ttDef: TtDef,
  actionDef: ActionDef,
  setDataAndConfig: ServiceDataSetter,
  cx: SRecord,
  context: NavigationContextType
) {
  const { getRemoteFilter } = context;
  const remoteFilter = getRemoteFilter(ttDef.name);
  const forward = actionDef.forward;
  if (!forward) {
    console.warn(`Value of forward is empty (action name ${actionDef.name})!`);
    return;
  }
  try {
    dispatchLoading('Loading...');
    // refresh & update
    if (forward === 'refresh' || forward === 'update') {
      const remoteFilter0: SRecord = {};
      if (remoteFilter) {
        ttDef.attributes.forEach((att) => {
          const name = att.name;
          const remoteFilterDef = att.remoteFilter;
          const remoteFilterVal = remoteFilter[name];
          if (remoteFilterDef && remoteFilterVal) {
            if (remoteFilterDef === 'startWith') {
              remoteFilter0[name] = remoteFilterVal + '%';
              remoteFilter0[name + 'Filter'] = remoteFilterVal + '%';
            }
            if (remoteFilterDef === 'contains') {
              remoteFilter0[name] = '%' + remoteFilterVal + '%';
              remoteFilter0[name + 'Filter'] = '%' + remoteFilterVal + '%';
            }
          }
        });
      }
      let contextParameters: SRecord = {};
      if (typeof actionDef.parameters === 'function') {
        contextParameters = actionDef.parameters(context);
      }
      const result = await processAction(actionDef, { ...cx, ...contextParameters, ...remoteFilter0 });
      if (result.exception) {
        dispatchException(result.exception);
      } else {
        setDataAndConfig(result);
      }
    }
    // other actions
    else {
      const result = await processAction(actionDef, cx);
      processForward({ actionDef, context, cx: toFirst(result), result });
    }
  } finally {
    dispatchLoading('');
  }
}
