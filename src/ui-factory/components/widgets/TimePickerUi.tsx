import { LocalizationProvider, MobileTimePicker, TimeField } from '@mui/x-date-pickers';
import { WidgetProps } from '../../types';
import moment from 'moment';
import { ttLabel } from '../../tabletool-utils';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useLang } from '../../redux';
import React from 'react';

export const pattern = 'HH:mm';

export function TimePickerUi({ def, value, action = () => {} }: WidgetProps) {
  const lang = useLang() || 'en';
  if (def.uiMode === 'desktop') {
    return <TimePickerDesktopUi def={def} value={value} action={action} />;
  }
  const value0 = value || def.defaultValue;
  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={lang}>
      <MobileTimePicker
        ampm={false}
        label={ttLabel(def)}
        format={pattern}
        value={value0 ? moment(value0.toString(), pattern) : null}
        onChange={(newValue: any) => {
          action('value', { [def.name]: newValue ? newValue.format(pattern) : '' });
        }}
      />
    </LocalizationProvider>
  );
}

export function TimePickerDesktopUi({ def, value, action = () => {} }: WidgetProps) {
  const lang = useLang() || 'en';
  const value0 = value || def.defaultValue;

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={lang}>
      <TimeField
        ampm={false}
        label={ttLabel(def)}
        format={pattern}
        value={value0 ? moment(value0.toString(), pattern) : null}
        onChange={(newValue: any) => {
          action('value', { [def.name]: newValue ? newValue.format(pattern) : '' });
        }}
      />
    </LocalizationProvider>
  );
}
