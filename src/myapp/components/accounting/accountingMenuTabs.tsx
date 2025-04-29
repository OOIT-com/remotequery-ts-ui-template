import { TtMenuTab } from '../../../app-support';
import { Box } from '@mui/material';
import React from 'react';

export const AccUi1 = () => {
  return <Box>Acc Ui1</Box>;
};
export const accountingMenuTabs: TtMenuTab[] = [
  {
    name: 'ACC TAB1',
    label: 'Accounting',
    Ui: AccUi1
  }
];
