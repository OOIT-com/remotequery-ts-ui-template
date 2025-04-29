import { ActionDef, ServiceDataSetter, TtDef } from '../../types';
import { processAction, toBoolean } from '../../tabletool-utils';
import { GridApi } from 'ag-grid-community';
import { dispatchException, dispatchLoading, getUserInfo } from '../../redux';

import { SRecord, toFirst } from 'remotequery-ts-common';
import { processForward } from '../navigation/process-forward';
import { NavigationContextType } from '../navigation/NavigationProvider';

export function createDefaultColDef(ttDef: TtDef) {
  return {
    filter: !ttDef.uiTypeOptions?.noFilters,
    resizable: toBoolean(ttDef.uiTypeOptions?.resizable, true),
    flex: 1,
    minWidth: 100
  };
}

export function processFilterInitValues(ttDef: TtDef, gridApi1?: GridApi) {
  if (gridApi1) {
    ttDef.attributes.forEach((attr) => {
      if (attr.filterInitValue) {
        const filterComponent = gridApi1.getColumnFilterModel(attr.name);
        if (filterComponent) {
          let filterInitValue;
          switch (attr.filterInitValue) {
            case 'USERID':
              filterInitValue = getUserInfo()?.userId;
              break;
            case 'TODAY':
              filterInitValue = new Date().toISOString();
              break;
            default:
              filterInitValue = attr.filterInitValue;
          }
          gridApi1.setColumnFilterModel(attr.name, {
            type: 'startsWith',
            filter: filterInitValue
          });
          gridApi1.onFilterChanged();
        }
      }
    });
  }
}

export function clearFilters(
  name: string,
  gridApi: GridApi | undefined,
  setQuickFilterText: (t: string) => void,
  { updateFilter }: NavigationContextType
) {
  if (gridApi) {
    gridApi.setFilterModel(null);
    gridApi.setGridOption('quickFilterText', '');
    setQuickFilterText('');
    updateFilter(name, {});
  }
}

export function localFilterIsEmpty(gridApi: GridApi): boolean {
  const filterValue = Object.values(gridApi.getFilterModel()).filter((v) => !!v);
  const quickFilter = gridApi.getQuickFilter();
  return !quickFilter && !filterValue.length;
}

export type ProcessRowAction = {
  name: string;
  actionDef: ActionDef;
  row: SRecord;
  setDataAndConfig: ServiceDataSetter;
  context: NavigationContextType;
};

export async function processRowAction({ name, actionDef, row, setDataAndConfig, context }: ProcessRowAction) {
  const { updateSelected, getCx } = context;
  try {
    const forward = actionDef.forward;
    dispatchLoading('Loading data...');
    const cx = getCx(name);
    updateSelected(name, { ...row });
    const result = await processAction(actionDef, { ...cx, ...row });

    if (result.exception) {
      dispatchException(result.exception);
      return;
    }
    if (forward === 'update') {
      setDataAndConfig(result);
    } else if (forward) {
      processForward({ actionDef, result, cx: toFirst(result), context });
    }
  } finally {
    dispatchLoading('');
  }
}
