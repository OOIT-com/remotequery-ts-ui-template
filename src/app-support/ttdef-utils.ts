import moment from 'moment/moment';

export const monthName = (i: number) => moment().month(i).format('MMMM');

export const monthSelectList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(
  (value, i) => ({
    label: monthName(i),
    value
  })
);

export const lastMonthMM = () => moment().subtract(1, 'month').format('MM');
