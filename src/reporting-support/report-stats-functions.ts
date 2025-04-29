import { RValue } from '../ui-factory/types';

export type RStatFun = (values: RValue[]) => RValue;

export const reportStatsFunctions: Record<string, RStatFun> = {
  sum,
  average,
  avg: average,
  empty
};

export function sum(values: RValue[]) {
  let sum = 0;
  if (!values) {
    return 0;
  }
  for (let i = 0; i < values.length; i++) {
    const v = +values[i];
    if (isNaN(v)) {
      //
    } else {
      sum += v;
    }
  }
  return sum;
}

export function empty() {
  return '-';
}

export function average(values: RValue[]) {
  const nvalues = [];

  if (!values) {
    return 0;
  }
  for (let i = 0; i < values.length; i++) {
    const v = +values[i];
    if (isNaN(v)) {
      //
    } else {
      nvalues.push(v);
    }
  }
  const i = Math.floor(nvalues.length / 2);
  return nvalues.sort()[i];
}
