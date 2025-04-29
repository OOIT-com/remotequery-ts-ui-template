import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { WidgetProps } from '../../types';
import moment from 'moment';
import { ttLabel } from '../../tabletool-utils';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useLang } from '../../redux';
import React from 'react';

const pattern = 'YYYY-MM-DD hh:mm';

export function DateTimePickerUi({ def, value, action = () => {} }: WidgetProps) {
  const lang = useLang() || 'en';
  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={lang}>
      <DateTimePicker
        label={ttLabel(def)}
        format={pattern}
        value={value ? moment(value.toString(), pattern) : null}
        onChange={(newValue: any) => {
          action('value', { [def.name]: newValue ? newValue.format(pattern) : '' });
        }}
      />
    </LocalizationProvider>
  );
}
