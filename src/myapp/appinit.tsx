import {
  CheckboxUi,
  DatePickerUi,
  DateTimePickerUi,
  DebugUi,
  InputUi,
  AutocompleteUi,
  MultilineInputUi,
  registerFunction,
  registerTtDefs,
  registerUiType,
  SelectUi,
  DetailPageUi,
  ListPageUi
} from '../ui-factory';
import React from 'react';

import { FileuploadUi } from '../ui-extensions/FileuploadUi';

import moment from 'moment';
import { processingResult } from './shared/ttdefs/processingResult';
import { messageResult } from './shared/ttdefs/messageResult';

// tabletool ui type registration
registerUiType({
  'detail-page': DetailPageUi,
  'list-page': ListPageUi,
  DebugUi,
  InputUi,
  AutocompleteUi,
  text: MultilineInputUi,
  textarea: MultilineInputUi,
  CheckboxUi,
  SelectUi,
  select: SelectUi,
  DatePickerUi,
  date: DatePickerUi,
  dateTime: DateTimePickerUi,
  DateTimePickerUi
});

// tabletool ui type registration
registerUiType({
  FileuploadUi
});

// common
registerTtDefs(processingResult);
registerTtDefs(messageResult);

// plugin functions

registerFunction('timeFromNow', (value: string | number) =>
  isNaN(+value) || +value === 0 ? '-' : moment(+value).fromNow()
);
registerFunction('dateFm', (value: string | number) => (isNaN(+value) ? '-' : moment(+value).format('YYYY-MM-DD')));
registerFunction('dateTimeFm', (value: string | number) =>
  isNaN(+value) ? '-' : moment(+value).format('YYYY-MM-DD HH:mm')
);
registerFunction('timeFm', (value: string | number) => {
  return isNaN(+value) || +value === 0 ? '-' : moment(+value).format('HH:mm (YYYY-MM-DD)');
});
registerFunction('vuFm', (value: any) => <span style={{ color: 'green' }}>{value}</span>);

moment.locale('de');
