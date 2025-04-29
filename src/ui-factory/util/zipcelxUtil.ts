import { AttributeDef, TtDef } from '../types';
import { ZipCelXConfig } from 'zipcelx';
import { Result } from 'remotequery-ts-common';

export function toZipcelxData(ttDef: TtDef, result: Result): ZipCelXConfig | undefined {
  if (!result || !result.header || !result.table || result.table.length === 0) {
    return;
  }

  const header = result.header;
  const table = result.table;

  const attributes: Record<string, AttributeDef> = {};
  ttDef.attributes.forEach((att) => (attributes[att.name] = att));

  const headerRow = createHeaderRow(header, attributes);
  const valueRows = createValueRows(header, table, attributes);

  const data = [headerRow, ...valueRows];

  return {
    filename: ttDef.name,
    sheet: {
      data
    }
  };
}

function createHeaderRow(header: string[], attributes: Record<string, AttributeDef>) {
  const t: string[] = header.filter((h) => !!attributes[h]);
  return t.map((h) => {
    let value = h;
    const att = attributes[h];
    if (att && att.label) {
      value = att.label;
    }
    return { value, type: 'string' };
  });
}

function createValueRows(header: string[], table: string[][], attributes: Record<string, AttributeDef>) {
  const valueRows: any[] = [];

  table.forEach((row) => {
    const _row: any = [];
    valueRows.push(_row);
    row.forEach((cellValue, index) => {
      const name = header[index];
      const att = attributes[name];
      if (att) {
        if (att.formatter) {
          cellValue = att.formatter(cellValue);
        }
        _row.push(_to_zipcelx_ele(cellValue));
      }
    });
  });

  return valueRows;
}

export function _to_zipcelx_ele(a: any) {
  const n = Number(a);
  return {
    value: '' == a || isNaN(n) ? a : n,
    type: '' == a || isNaN(n) ? 'string' : 'number'
  };
}
