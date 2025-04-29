import { reportPart } from './report-utils';
import React, { useMemo } from 'react';
import { GetLabelFun, ListPageUi, ResultNotEmpty, TtDef, useLabels, useUserInfo } from '../ui-factory';
import { DocumentDef, ReportPart, ReportResultUiProps, TTReportNormalized } from './report-types';
import { InputLabel, Stack } from '@mui/material';
import { RValue } from '../ui-factory/types';
import { getReportLogo } from './ReportLogo';
import { reportPdfRenderer } from './report-pdf-renderer';
import moment from 'moment/moment';
import { reportExcelRender } from '../app-support/excel-utils';
import FileSaver from 'file-saver';
import { API_BASE } from '../app-support/api-helper';

const createAndDownloadExcel = async (
  userId: string,
  ttReport: TTReportNormalized,
  part: ReportPart, // data: ServiceDataNotEmpty,
  l: GetLabelFun
) => {
  const documentDef: DocumentDef = {
    title: l(ttReport),
    layout: 'portrait',
    filename: (ttReport.filename || ttReport.name) + '-' + moment().format('YYYY-MM-DD'),
    parts: [part]
  };

  const document = await reportExcelRender(documentDef);
  FileSaver.saveAs(`${API_BASE}docu/sha/${document.fileTid}/${document.filename}`, document.filename.toString());
};

export function ResultAgGridUi({ def, data, cxRow }: ReportResultUiProps) {
  const userId = useUserInfo()?.userId || 'unknown';
  const textAligns = useMemo(() => def.textAligns || [], [def]);
  const { l, d } = useLabels();

  const part = useMemo(
    () =>
      reportPart({
        def,
        data,
        serviceId: def.serviceId || '',
        parameters: { ...cxRow },
        L: l,
        D: d
      }),
    [def, data, cxRow, l, d]
  );

  const result: ResultNotEmpty = useMemo(
    () => ({
      header: part.dData.header.map(({ name }) => name),
      table: part.dData.table.map((row) => row.map(({ formatted }) => formatted))
    }),
    [part]
  );

  const { dData } = part;

  const table1 = dData.table;

  const rows: Record<string, RValue>[] = useMemo(
    () =>
      table1.map((r, id) => {
        const row: Record<string, RValue> = { id };
        dData.header.forEach(({ name }, i) => {
          row[name] = r[i].formatted;
        });
        return row;
      }),
    [dData.header, table1]
  );

  // USING TOP LIST AG UI

  const ttdef: TtDef = useMemo(
    () => ({
      uiType: 'list-page',
      uiTypeOptions: { useQuickFilter: true },
      name: def.name,
      label: def.label,
      attributes: part.dData.header.map(({ name, label }, index) => ({
        name,
        label,
        filter: def.filters === true,
        className: textAligns[index] === 'right' ? 'tt-right' : ''
      })),
      actions: [
        {
          name: 'createExcel',
          label: 'Excel',
          service: async () => {
            await createAndDownloadExcel(userId, def, part, l);
            return {};
          },
          source: 'toolbar',
          forward: 'skip'
        },
        {
          name: 'createPdf',
          label: 'PDF',
          service: async () => {
            await createPdf(userId, def, part, l);
            return {};
          },
          source: 'toolbar',
          forward: 'skip'
        }
      ]
    }),
    [def, part, userId, textAligns, l]
  );

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0}>
        <InputLabel sx={{ fontSize: '1em', fontStyle: 'italic', paddingRight: '1em' }}>{`${l(
          'Report Result'
        )} ${'found:'} ${rows.length}`}</InputLabel>
      </Stack>

      <div className="ag-theme-balham" style={{ height: '100%' }}>
        <ListPageUi
          ttDef={ttdef}
          result={result}
          pinnedRowIndex={def.hasSumRow ? result.table.length - 1 : undefined}
          agGridOptions={{ pagination: def.pagination, filters: def.filters }}
        ></ListPageUi>
      </div>
    </Stack>
  );
}

async function createPdf(
  userId: string,
  ttReport: TTReportNormalized,
  part: ReportPart, // data: ServiceDataNotEmpty,
  l: GetLabelFun
) {
  //
  // const part = reportPart({
  //   def: ttReport,
  //   data,
  //   L: l,
  //   D: d
  // });
  const logoBase64Url = await getReportLogo();
  const documentDef: DocumentDef = {
    title: l(ttReport),
    filename: ttReport.filename || ttReport.name,
    layout: 'landscape',
    footerMiddle: l('created-by') + ' ' + userId,
    parts: [part],
    logoBase64Url,
    pageSize: 'A4'
  };
  reportPdfRenderer(documentDef, l);
}
