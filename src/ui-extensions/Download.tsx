import React, { ReactNode } from 'react';
import FileSaver from 'file-saver';
import { API_BASE } from '../app-support/api-helper';
import { Box } from '@mui/material';
import { CellRendererFun } from '../ui-factory';

export const download: CellRendererFun = ({ data }): ReactNode => {
  if (typeof data === 'object') {
    const { filename, fileTid } = data;
    return (
      <Box
        sx={{ cursor: 'pointer' }}
        onClick={(e) => {
          // TODO this does not work in ag-grid rows ???
          e.stopPropagation();
          FileSaver.saveAs(`${API_BASE}docu/sha/${fileTid}/${filename}`, filename);
        }}
      >
        {filename}
      </Box>
    );
  }
  return <pre>-not an object-</pre>;
};
