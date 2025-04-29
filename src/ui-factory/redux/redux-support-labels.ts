import { useSelector } from 'react-redux';
import { getStore, RootState } from './redux-tookit';
import { Label, LabelMap, RValue } from '../types';
import { dispatchDataMap } from './redux-support-tt';
import { texting } from '../tabletool-utils';
import { useEffect } from 'react';

const useLabelList = (): Label[] => useSelector((state: RootState) => state.tt.dataMap['labels']);
const getLabelList = () => getStore().getState().tt.dataMap['labels'];

const useLabelMap = (): LabelMap => useSelector((state: RootState) => state.tt.dataMap['labelMap']);
const getLabelMap = () => getStore().getState().tt.dataMap['labelMap'];

export let LABEL_MAP: LabelMap = {};

export const dispatchLabels = (labels: Label[]) => {
  dispatchDataMap<Label[]>('labels', labels);
  const labelMap: LabelMap = {};
  labels.forEach((label) => {
    labelMap[label.name] = label;
  });
  dispatchDataMap<LabelMap>('labelMap', labelMap);

  LABEL_MAP = labelMap;
};

export type GetLabelFun = (arg0: string | any, arg1?: any) => string;

export type FormatFun = (value: RValue, l: GetLabelFun) => string;

let getLabel: GetLabelFun = () => '-label-';
let getDescription: GetLabelFun = () => '-label-';

export const useLabels = () => {
  const map = useLabelMap();
  const list = useLabelList();

  useEffect(() => {
    getLabel = (arg0: string | any, arg1?: any): string => {
      let l = _getLabel(arg0, map);
      if (typeof l === 'object') {
        l = l.label;
      }
      if (typeof arg1 === 'object') {
        l = texting(l, arg1);
      }
      return l;
    };
    getDescription = (arg0: string | any, arg1?: any) => {
      if (arg0?.description) {
        return arg0.description;
      }
      let l = _getLabel(arg0, map);
      if (typeof l === 'object') {
        l = l.description;
      }
      if (typeof arg1 === 'object') {
        l = texting(l, arg1);
      }
      return l;
    };
  }, [map, list]);

  const l = getLabel;
  const d = getDescription;
  if (typeof l !== 'function') {
    console.warn('l is not a function');
  }
  return { label: l, l, d, description: d, list, map };
};

export const getLabels = () => {
  const map = getLabelMap();
  const list = getLabelList();
  const l = getLabel;
  const d = getDescription;
  return { label: l, l, d, description: d, list, map };
};

const _getLabel = (arg0: string | any, map: LabelMap): string | Label => {
  if (arg0 === undefined || arg0 === null) {
    return '-undefined-';
  }
  if (!map) {
    return arg0;
  }
  if (typeof arg0 === 'string') {
    return map[arg0] || arg0;
  } else {
    return (
      arg0.label ||
      arg0.title ||
      map[arg0.labelId] ||
      arg0.labelId ||
      map[arg0.name] ||
      map[arg0.value] ||
      arg0.name ||
      arg0.value ||
      ''
    );
  }
};
