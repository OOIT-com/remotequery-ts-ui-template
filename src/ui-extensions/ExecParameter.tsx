import React, { useMemo } from 'react';
import { InputAdornment, InputLabel, TextField } from '@mui/material';
import { InputOutlined } from '@mui/icons-material';

import { SRecord } from 'remotequery-ts-common';
import { useNavigationContext } from '../ui-factory/components/navigation/navigation-utils';

export function ExecParameter() {
  const { getData, updateData } = useNavigationContext();
  const data = getData('...');
  const execParameters: SRecord = JSON.parse(data.execParameters);
  const query = data.query || '';
  const paramNames = useMemo(() => getParamNames(query.toString()), [query]);

  return (
    <div style={{ marginBottom: '2em' }}>
      <InputLabel sx={{ fontSize: '1.2em' }}>Parameters</InputLabel>
      <div style={{ padding: '0 3em' }}>
        {paramNames.map((name) => (
          <div key={name} style={{ marginTop: '1em' }}>
            <TextField
              label={name}
              autoComplete={'off'}
              fullWidth
              type={'text'}
              value={execParameters[name] || ''}
              onChange={(e) => {
                const _execParameters: SRecord = { ...execParameters, [name]: e.target.value };
                updateData('...', { ...data, execParameters: JSON.stringify(_execParameters) });
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InputOutlined />
                  </InputAdornment>
                )
              }}
              variant="standard"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function getParamNames(query: string): string[] {
  const _set: Set<string> = new Set<string>();
  const regEx = /[:](\w*)(\s|$|\))/g;
  let match = regEx.exec(query);

  while (match !== null) {
    if (match[1]) _set.add(match[1]);
    match = regEx.exec(query);
  }
  return Array.from(_set);
}
