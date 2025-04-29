import React from 'react';
import { ReactElement } from 'react';
import { Box } from '@mui/material';
import { useLabels } from '../..';

export function UiSection({ content }: { content: ReactElement | string }): ReactElement {
  const { l } = useLabels();
  if (typeof content === 'string') {
    return <Box sx={{ fontWeight: 'bold', fontSize: '1.2em', margin: '0.3 0' }}>{l(content)}</Box>;
  }
  return content;
}
