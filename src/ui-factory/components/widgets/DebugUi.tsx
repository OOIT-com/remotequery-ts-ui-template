import React from 'react';
import { WidgetProps } from '../../types';
import { JsonViewer } from '@textea/json-viewer';
import { useTTState } from '../../redux';
import { InputLabel } from '@mui/material';

export function DebugUi({ def, cx }: WidgetProps) {
  const state = useTTState();

  return (
    <div>
      <InputLabel sx={{ fontWeight: 'bold' }}>TTDef</InputLabel>
      <JsonViewer value={def} />
      <InputLabel>CX</InputLabel>
      {typeof cx === 'object' ? <JsonViewer value={cx} /> : 'empty'}
      <InputLabel>TTState</InputLabel>
      {typeof state === 'object' ? <JsonViewer value={state} /> : 'empty'}
    </div>
  );
}
