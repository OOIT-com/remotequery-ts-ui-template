import { ZipCelXConfig } from 'zipcelx';
import { DData, DHeader, DRow, DSumRow } from './report-types';
import { _to_zipcelx_ele } from '../ui-factory/util/zipcelxUtil';

export function toZipcelxData4Report(dData: DData, filename: string): ZipCelXConfig | undefined {
  const headerRow = createHeaderRow(dData.header);
  const valueRows = createValueRows(dData.table);
  return {
    filename,
    sheet: {
      data: [headerRow, ...valueRows]
    }
  };
}

function createHeaderRow(header: DHeader[]) {
  return header.map((h) => ({ value: h.label, type: 'string' }));
}

function createValueRows(table: (DRow | DSumRow)[]) {
  const valueRows: any[] = table.map((row) => row.map((dCell) => _to_zipcelx_ele(dCell.formatted)));

  return valueRows;
}
