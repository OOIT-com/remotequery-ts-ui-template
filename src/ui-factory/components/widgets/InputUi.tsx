import React from 'react';
import { resolveEditable, ttLabel } from '../../tabletool-utils';
import { TextField } from '@mui/material';
import { WidgetProps } from '../../types';

let counter = 0;

export function InputUi<V = string>({ def, value, cx = {}, action = () => {} }: Readonly<WidgetProps<V>>) {
  const id = 'InputUi' + counter++;

  const currentValue = value || '';

  const type = def.inputType ?? 'text';
  //
  const editable = resolveEditable({ def, cx, defaultValue: true });

  return (
    <TextField
      InputLabelProps={{
        shrink: true
      }}
      // helperText={validationResult}
      // error={!!validationResult}
      label={ttLabel(def)}
      autoComplete={'off'}
      fullWidth
      size={'small'}
      multiline={!!def.multiline}
      maxRows={def.maxRows}
      id={id}
      type={type}
      value={currentValue}
      onChange={(e) => action('value', { [def.name]: e.target.value })}
      disabled={!editable}
    />
  );
}

export function MultilineInputUi({ def, value, cx, action = () => {} }: WidgetProps) {
  return <InputUi def={{ ...def, multiline: true }} value={value} cx={cx} action={action} />;
}
