import React, { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
import { Result, SRecord } from 'remotequery-ts-common';
import { SetFun, SetNameFun } from '../../types';

export type SetNamedSRecord = SetNameFun<SRecord>;
export type SetNamedResult = SetNameFun<Result>;
export type GetNamedSRecord = (name: string) => SRecord;
export type GetNamedResult = (name: string) => Result;

export type NavigationContextType = {
  initialForward: string;
  forward: string;
  updateForward: SetFun<string>;
  back: () => void;

  updateCx: SetNamedSRecord;
  getCx: GetNamedSRecord;

  updateData: SetNamedSRecord;
  getData: GetNamedSRecord;

  updateResult: SetNamedResult;
  getResult: GetNamedResult;

  updateSelected: SetNamedSRecord;
  getSelected: GetNamedSRecord;

  updateFilter: SetNamedSRecord;
  getFilter: GetNamedSRecord;

  updateRemoteFilter: SetNamedSRecord;
  getRemoteFilter: GetNamedSRecord;
};

const emptySRecord: SRecord = {};
const emptyResult: Result = {};

const noop = () => {};
const noop2 = () => emptySRecord;

const initialContextValue: NavigationContextType = {
  initialForward: '',
  forward: '',
  updateForward: noop,
  back: noop,

  updateCx: noop,
  getCx: noop2,

  updateData: noop,
  getData: noop2,

  updateResult: noop,
  getResult: noop2,

  updateSelected: noop,
  getSelected: noop2,

  updateFilter: noop,
  getFilter: noop2,

  updateRemoteFilter: noop,
  getRemoteFilter: noop2
};

export const NavigationContext = createContext<NavigationContextType>(initialContextValue);

export function NavigationProvider(props: { initialForward: string; children: ReactNode }) {
  const [forward, setForward] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cx, setCx] = useState<Record<string, SRecord>>({});
  const [data, setData] = useState<Record<string, SRecord>>({});
  const [result, setResult] = useState<Record<string, Result>>({});
  const [selected, setSelected] = useState<Record<string, SRecord>>({});
  const [filter, setFilter] = useState<Record<string, SRecord>>({});
  const [remoteFilter, setRemoteFilter] = useState<Record<string, SRecord>>({});

  const back = useCallback(() => {
    if (history.length === 0) {
      setForward('');
    } else if (history.length === 1) {
      setForward('exit');
    } else {
      history.pop();
      const newHistory = [...history];
      setHistory(newHistory);
      setForward(newHistory[newHistory.length - 1] || '');
    }
  }, [history]);

  const updateForward = useCallback(
    (f: string) => {
      if (f !== forward) {
        setForward(f);
        setHistory([...history, f]);
      }
    },
    [history, forward]
  );

  const getCx = useCallback((name: string) => cx[name] || emptySRecord, [cx]);
  const getData = useCallback((name: string) => data[name] || emptySRecord, [data]);
  const getResult = useCallback((name: string) => result[name] || emptyResult, [result]);
  const getSelected = useCallback((name: string) => selected[name] || emptySRecord, [selected]);
  const getFilter = useCallback((name: string) => filter[name] || emptySRecord, [filter]);
  const getRemoteFilter = useCallback((name: string) => remoteFilter[name] || emptySRecord, [remoteFilter]);

  const updateData = useCallback((name: string, f: SRecord) => setData((r) => ({ ...r, [name]: f })), [setData]);
  const updateResult = useCallback((name: string, f: Result) => setResult((r) => ({ ...r, [name]: f })), [setResult]);
  const updateCx = useCallback((name: string, f: SRecord) => setCx((r) => ({ ...r, [name]: f })), [setCx]);
  const updateSelected = useCallback(
    (name: string, f: SRecord) =>
      setSelected((r) => ({
        ...r,
        [name]: f
      })),
    [setSelected]
  );
  const updateFilter = useCallback((name: string, f: SRecord) => setFilter((r) => ({ ...r, [name]: f })), [setFilter]);
  const updateRemoteFilter = useCallback(
    (name: string, f: SRecord) =>
      setRemoteFilter((r) => ({
        ...r,
        [name]: f
      })),
    [setRemoteFilter]
  );

  const value = useMemo(
    () => ({
      initialForward: props.initialForward,
      forward,
      updateForward,
      back,

      updateCx,
      getCx,

      updateData,
      getData,

      updateResult,
      getResult,

      updateSelected,
      getSelected,

      updateFilter,
      getFilter,

      updateRemoteFilter,
      getRemoteFilter
    }),
    [
      props.initialForward,
      forward,
      updateForward,
      back,
      updateCx,
      getCx,
      updateData,
      getData,
      updateResult,
      getResult,
      updateSelected,
      getSelected,
      updateFilter,
      getFilter,
      updateRemoteFilter,
      getRemoteFilter
    ]
  );

  return <NavigationContext.Provider value={value}>{props.children}</NavigationContext.Provider>;
}
