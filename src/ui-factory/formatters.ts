import moment from 'moment/moment';
import { FormatterFun } from './types';

export const unixtime2IsoDateTime: FormatterFun = (value: string) => {
  return isNaN(+value) ? '-' : moment(+value).format('YYYY-MM-DD HH:mm');
};
