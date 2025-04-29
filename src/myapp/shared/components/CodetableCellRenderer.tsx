import { AttributeDef, CellRendererFun, useCodeTable } from '../../../ui-factory';
import { SRecord } from 'remotequery-ts-common';
import React from 'react';
export const CodetableCellRendererFun: CellRendererFun = ({
  attribute,
  data
}: {
  data: SRecord;
  attribute: AttributeDef;
}) => {
  const tableName = attribute.uiTypeOptions?.codeTable || '';
  const codeTable = useCodeTable(tableName);
  const code = data[attribute.name];

  const s = codeTable?.find((c) => c.name === code);
  return <div>{s?.label}</div>;
};
