import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { WidgetProps } from '../../types';
import moment from 'moment';
import { resolveBoolean, ttLabel } from '../../tabletool-utils';
import { useLang } from '../../redux';
import React from 'react';

const pattern = 'YYYY-MM-DD';

export function DatePickerUi({ def, value, action = () => {}, cx = {} }: WidgetProps) {
  const lang = useLang() || 'en';
  const editable = resolveBoolean(def, 'editable', cx, true);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={lang}>
      <DatePicker
        maxDate={moment('9999-12-31', pattern)}
        slotProps={{
          textField: { size: 'small' }
        }}
        disabled={!editable}
        sx={{ width: '100%' }}
        format={pattern}
        label={ttLabel(def)}
        value={value ? moment(value.toString(), pattern) : null}
        onChange={(newValue: any) => {
          action('value', { [def.name]: newValue ? newValue.format(pattern) : '' });
        }}
      />
    </LocalizationProvider>
  );
}
