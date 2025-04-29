import {
  DCell,
  DData,
  DocumentDef,
  DRequest,
  DSumCell,
  NamedFun,
  NamedFunNames,
  RDef,
  ReportPart,
  ReportPartArgs,
  TTReport,
  TTReportNormalized
} from './report-types';
import { reportStatsFunctions } from './report-stats-functions';
import { FormatFun, GetLabelFun, RValue } from '../ui-factory';
import { reportPdfRenderer } from './report-pdf-renderer';

export function reportPart({ def, data, serviceId, parameters = {}, L, D }: ReportPartArgs): ReportPart {
  let dRequest: DRequest | undefined = undefined;
  const dData: DData = {
    header: [],
    table: []
  };
  const sumRowValues: DSumCell[] = [];
  const pfx = def.columnNamePrefix;

  const sqlHeader = def.headerMode === 'sqlHeader' ? data.headerSql || [] : undefined;

  // dheader, sumRowValues
  data.header.forEach((name, col) => {
    if (def.columnFunctions[col] === 'hidden') {
      return;
    }
    dData.header.push({
      name,
      label: sqlHeader ? sqlHeader[col] || '' : L(pfx + name),
      description: D(pfx + name),
      width: def.cellWidths[col] || def.defaultCellWidth
    });
    if (def.hasSumRow) {
      sumRowValues.push({
        values: [],
        value: '',
        align: def.textAligns[col] || 'left',
        calcFunName: def.sumRow[col] || 'empty',
        formatted: ''
      });
    }
  });

  // dRow sumRowValues
  data.table.forEach((row) => {
    const dRow: DCell[] = [];
    dData.table.push(dRow);
    row.forEach((value, col) => {
      if (def.columnFunctions[col] === 'hidden') {
        return;
      }
      const align = def.textAligns[col] || '';
      const colFun = def.columnFunctions[col] || 'id';

      dRow.push({
        value,
        formatted: format(colFun, value, L),
        align: align
      });

      if (def.hasSumRow) {
        sumRowValues[col].values.push(value);
        sumRowValues[col].align = align;
      }
    });
  });

  if (def.hasSumRow) {
    dData.table.push(sumRowValues);
    sumRowValues.forEach((sVal, col) => {
      if (def.columnFunctions[col] === 'hidden') {
        return;
      }
      const colFun = def.columnFunctions[col] || 'id';
      sVal.value = reportStatsFunctions[sVal.calcFunName](sVal.values);
      sVal.formatted = format(colFun, sVal.value, L);
      sVal.values = [];
    });
  }

  //
  // parameter display (dParameters)
  //
  if (serviceId && parameters) {
    dRequest = {
      dServiceId: serviceId,
      dParameters: []
    };
    Object.values(def.rAttributes || {}).forEach((att) => {
      if (att.dParameter === true && dRequest) {
        dRequest.dParameters.push({
          label: L(att),
          value: parameters[att.name],
          name: att.name
        });
      }
    });
  }

  return {
    name: def.name,
    title: def.title || L(def),
    description: def.description ?? D(def),
    dData,
    dRequest
  };
}

export function normalize(def: TTReport): TTReportNormalized {
  let attributesList: RDef[] = [];

  if (def.attributesList) {
    attributesList = def.attributesList;
  } else if (def.rAttributes) {
    attributesList[0] = {
      name: def.name,
      label: def.label ?? def.title,
      attributes: def.rAttributes,
      actions: [{ name: 'Start', serviceId: def.serviceId }]
    };
  } else {
    attributesList[0] = {
      name: def.name,
      label: def.label ?? def.title,
      attributes: [],
      actions: [{ name: 'Start', serviceId: def.serviceId }]
    };
  }

  return {
    ...def,
    label: def.label ?? def.title,
    columnFunctions: def.columnFunctions || [],
    cellWidths: def.cellWidths || [],
    textAligns: def.textAligns || [],
    columnNamePrefix: def.columnNamePrefix ?? '',
    defaultCellWidth: def.defaultCellWidth ?? 0,
    hasSumRow: !!(def.sumRow && def.sumRow.length > 0),
    sumRow: def.sumRow || [],
    layout: def.layout ?? 'portrait',
    title: def.title ?? '',
    pageSize: def.pageSize ?? 'A4',
    attributesList
  };
}

export const _namedFunctions: Record<NamedFunNames, NamedFun> = {
  id: (value: RValue) => value,
  fixed,
  fixed2,
  hidden: (value: RValue) => value
};

export function fixed(value: RValue) {
  if (!value || isNaN(+value)) {
    return value;
  }
  return (+value).toFixed(0);
}

export function fixed2(value: RValue) {
  if (!value || isNaN(+value)) {
    return value;
  }
  return (+value).toFixed(2);
}

function format(name: NamedFunNames | FormatFun, value: RValue, L: GetLabelFun) {
  if (typeof name === 'function') {
    return name(value, L);
  }
  if (typeof name !== 'function') {
    const f: NamedFun | undefined = _namedFunctions[name];
    return f(value, L).toString();
  } else {
    return value.toString();
  }
}

export function createPdf(reportDef: TTReportNormalized, parts: ReportPart[], l: GetLabelFun, logoBase64Url: string) {
  const documentDef: DocumentDef = {
    layout: reportDef.layout,
    filename: reportDef.filename ?? 'report-file',
    title: reportDef.title,
    pageSize: reportDef.pageSize ?? 'A4',
    parts,
    logoBase64Url
  };
  reportPdfRenderer(documentDef, l);
}

const TTREPORT_MAP: Record<string, TTReport> = {};

export function registerTtReport(def: TTReport) {
  TTREPORT_MAP[def.name] = def;
}

export function getTtReport(name: string): TTReportNormalized | undefined {
  if (TTREPORT_MAP[name]) {
    return normalize(TTREPORT_MAP[name]);
  }
}
