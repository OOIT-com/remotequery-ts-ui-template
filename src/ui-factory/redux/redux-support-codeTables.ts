import { useSelector } from 'react-redux';
import { RootState } from './redux-tookit';
import { CodeTableEntries, CodeTablesMap } from '../types';
import { dispatchDataMap } from './redux-support-tt';

export const dispatchCodeTables = (codeTablesEntries: CodeTableEntries[]) => {
  dispatchDataMap<CodeTableEntries[]>('codeTables', codeTablesEntries);
  const codeTableMap: CodeTablesMap = {};
  codeTablesEntries.forEach((e) => {
    let codeTables = codeTableMap[e.tableName];
    if (!codeTables) {
      codeTables = [];
      codeTableMap[e.tableName] = codeTables;
    }
    codeTables.push(e);
  });
  dispatchDataMap<CodeTablesMap>('codeTableMap', codeTableMap);
};

export const useCodeTable = (tableName: string): CodeTableEntries[] | undefined => {
  return useSelector((state: RootState) => {
    if (state.tt.dataMap['codeTableMap']) {
      if (state.tt.dataMap['codeTableMap'][tableName || '']) {
        return state.tt.dataMap['codeTableMap'][tableName || ''];
      }
    }
    return [];
  });
};
