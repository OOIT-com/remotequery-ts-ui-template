import React, { useMemo } from 'react';
import { errorMessage, GetLabelFun, StatusMessageElement, useLabels, usePaletteMode } from '../ui-factory';
import { ReportResultUiProps, TTReport, TTReportNormalized } from './report-types';
import { toList } from 'remotequery-ts-common';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridOptions } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

export function ReportResultAgGridSimpleUi({ def, data }: ReportResultUiProps) {
  const { l } = useLabels();
  const paletteMode = usePaletteMode();

  const list = useMemo(() => toList(data), [data]);

  if (list.length === 0) {
    return <StatusMessageElement sx={{ margin: '1em' }} statusMessage={errorMessage(l('No data found'))} />;
  }

  return (
    <div className={`ag-theme-quartz${paletteMode === 'dark' ? '-dark' : ''}`} style={{ height: '100%' }}>
      <AgGridReact
        domLayout="autoHeight"
        defaultColDef={createDefaultColDef(def)}
        gridOptions={createGridOptions(def, data.header, l)}
        rowData={list}
        pagination={def?.pagination !== false}
      />
    </div>
  );
}

export function createDefaultColDef(def: TTReport): ColDef {
  return {
    filter: def.filters !== false,
    resizable: true,
    sortable: false,
    suppressHeaderMenuButton: true
  };
}

export function createGridOptions(def: TTReportNormalized, header: string[], label: GetLabelFun): GridOptions<any> {
  const sumOfWidth = def.cellWidths.reduce((a, c) => a + (c || 0), 0) || 1;

  const columnDefs: ColDef[] = header.map((head, index) => ({
    headerName: label(head),
    field: head,
    flex: def.cellWidths[index] || sumOfWidth / header.length,
    type: def.textAligns[index] === 'right' ? 'rightAligned' : undefined
  }));

  return {
    columnDefs,
    pagination: def.pagination !== false,
    paginationPageSize: 1000,
    rowSelection: 'single'
  };
}
