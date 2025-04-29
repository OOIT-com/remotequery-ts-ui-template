import React, { useEffect, useState } from 'react';
import { WidgetProps } from '../../types';
import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { resolveBoolean, ttLabel } from '../../tabletool-utils';

let counter = 0;

export function CheckboxUi({
  def,
  value,
  action = () => {},
  cx = {},
  valueAction,
  size,
  labelPlacement
}: WidgetProps & {
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  size?: 'small' | 'medium' | 'large';
}) {
  const [currentValue, setCurrentValue] = useState('');

  useEffect(() => setCurrentValue(value || def.defaultValue || ''), [def, value]);

  const name = 'CheckboxUi-name-' + counter++;
  const emptyClassName = currentValue ? '' : 'empty';
  //
  const editable = resolveBoolean(def, 'editable', cx, true);
  const editableClassName = editable ? '' : 'disabled';

  const onValue = def.uiTypeOptions?.onValue || 'true';
  const offValue = def.uiTypeOptions?.offValue || 'false';

  return render();

  function render() {
    return (
      <FormControl variant={'outlined'}>
        <FormControlLabel
          className={[emptyClassName, editableClassName].join(' ')}
          label={ttLabel(def)}
          labelPlacement={labelPlacement}
          control={
            <Checkbox
              size={size}
              disabled={!editable}
              name={name}
              checked={value === onValue}
              onChange={(e) => {
                if (valueAction) {
                  valueAction(e.target.checked.toString());
                }
                action('value', { [def.name]: e.target.checked ? onValue : offValue });
              }}
              className="form-check-input"
            />
          }
        ></FormControlLabel>
      </FormControl>
    );
  }
}
