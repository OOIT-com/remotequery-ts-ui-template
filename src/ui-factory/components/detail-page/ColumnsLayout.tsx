import React, { ReactElement } from 'react';
import { Grid } from '@mui/material';

export type ColumnContent = { key: string; columnSpan?: number; content: ReactElement };

export function ColumnsLayout({
  numberOfColumns = 1,
  elements
}: Readonly<{
  numberOfColumns?: number;
  elements: ColumnContent[];
}>): ReactElement {
  const sx = Math.floor(12 / numberOfColumns);
  return (
    <Grid container spacing={2}>
      {/*{columns}*/}
      {elements.map(({ key, columnSpan, content }) => (
        <Grid key={key} item xs={sx * (columnSpan ?? 1)}>
          {content}
        </Grid>
      ))}
    </Grid>
  );
}
