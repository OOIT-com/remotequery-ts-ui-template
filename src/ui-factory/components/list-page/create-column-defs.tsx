import { TtDef } from '../../types';
import { ColDef, ValueFormatterFunc } from 'ag-grid-community';
import { SRecord } from 'remotequery-ts-common';
import { ttLabel } from '../../tabletool-utils';
import Box from '@mui/material/Box';
import React from 'react';

export function createColumnDefs(ttDef: TtDef, rightColumnActionCellRenderer: any): ColDef<SRecord>[] {
  const columnDefs: ColDef[] = ttDef.attributes.map((attr) => {
    const valueFormatterFunc: ValueFormatterFunc<SRecord> = ({ value }) => {
      if (attr.formatter && typeof value === 'string') {
        return attr.formatter(value);
      } else {
        return value;
      }
    };

    const c: ColDef<SRecord> = {
      headerName: attr.noLabel === true ? '' : ttLabel(attr),
      headerTooltip: attr.description,
      field: attr.name,
      width: attr.width || 140,
      minWidth: attr.width || 140,
      sortable: true,
      cellStyle: { whiteSpace: 'nowrap' },
      type: attr.uiTypeOptions?.dataType === 'number' ? 'rightAligned' : undefined,
      valueFormatter: valueFormatterFunc,
      suppressHeaderMenuButton: true,
      hide: attr.hidden,
      cellClass: attr.className
    };

    if (typeof attr.cellRenderer === 'function') {
      c.cellRenderer = (value: any) => {
        const data = value.data as SRecord;
        if (attr.cellRenderer) {
          return attr.cellRenderer({ data, attribute: attr });
        }
        return <Box>{data[attr.name]}</Box>;
      };
    }

    return {
      ...c,
      filter: !!attr.filter,
      floatingFilter: !!attr.filter,
      filterParams: {
        applyButton: true,
        resetButton: true
      }
    };
  });

  if (ttDef.actions.filter((a) => a.source === 'rowRight').length) {
    columnDefs.push({
      headerName: 'Actions',
      headerTooltip: 'Row actions...',
      field: '_actions_',
      minWidth: 120,
      sortable: false,
      cellStyle: { whiteSpace: 'nowrap' },
      suppressHeaderMenuButton: true,
      filter: false,
      floatingFilter: false,
      pinned: 'right',
      lockPinned: true,
      flex: 2,
      suppressSizeToFit: false,
      resizable: true,
      cellRenderer: rightColumnActionCellRenderer
    });
  }

  return columnDefs;
}
