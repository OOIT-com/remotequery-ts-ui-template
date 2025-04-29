import { ActionDef, AttributeDef, DynamicBooleanAttributeValue, LabelDef, TtDef, WithTTDefProp } from './types';
import { LABEL_MAP } from './redux';
import { isTtDef } from './types-util';
import { Result, SRecord, toResult } from 'remotequery-ts-common';
import { FC } from 'react';
import { processService } from './api';

const TT_DEF_MAP: Record<string, TtDef> = {};
const WIDGET_MAP: any = {};
const FUNCTION_MAP: any = {};

export function resolveEditable({ def, cx, defaultValue }: { def: AttributeDef; cx?: SRecord; defaultValue: boolean }) {
  return resolveBoolean(def, 'editable', cx ?? {}, defaultValue);
}

export function resolveBoolean(def: AttributeDef, propertyName: 'editable', cx: SRecord, defaultValue: any) {
  if (!def || !propertyName) {
    return defaultValue;
  }
  const propValue = def[propertyName];
  if (typeof propValue === 'boolean') {
    return propValue;
  }
  if (propValue === 'true') {
    return true;
  }
  if (propValue === 'false') {
    return false;
  }
  if (typeof propValue === 'function') {
    return propValue(cx);
  }
  return defaultValue;
}

export function resolveBoolean2(propValue: DynamicBooleanAttributeValue, cx: SRecord) {
  if (typeof propValue === 'boolean') {
    return propValue;
  }
  if (propValue === 'true') {
    return true;
  }
  if (propValue === 'false') {
    return false;
  }
  if (typeof propValue === 'function') {
    return propValue(cx);
  }
}

export function toBoolean(value: boolean | string | undefined, defaultValue: boolean) {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  return defaultValue;
}

export function resolveFunction(arg0: any, default0: any) {
  let r;
  if (typeof arg0 === 'function') {
    r = arg0;
  } else if (typeof arg0 === 'string') {
    r = FUNCTION_MAP[arg0];
  }
  return r || default0;
}

export function registerFunction(name: string, fun: any) {
  FUNCTION_MAP[name] = fun;
}

const resolveLabelDef = (def: LabelDef): string =>
  def.label || LABEL_MAP[def.labelId || '']?.label || LABEL_MAP[def.name || '']?.label || def.labelId || def.name || '';

export function ttLabel(labelDef: LabelDef | string = '', value: SRecord = {}) {
  try {
    let template: string = '';
    let mandatory = false;
    let isKey = false;
    if (labelDef === undefined) {
      return '<nolabel>';
    }
    if (typeof labelDef === 'string') {
      template = LABEL_MAP[labelDef]?.label || labelDef;
    } else {
      if (labelDef.noLabel) {
        return '';
      }
      mandatory = !!labelDef.mandatory;
      isKey = !!labelDef.isKey;
      if (!labelDef) {
        template = '';
      } else {
        template = resolveLabelDef(labelDef) || '<nolabel>';
      }
    }
    return `${isKey ? '🔑' : ''}${texting(template, value)}${mandatory && !isKey ? '*' : ''}`;
  } catch (e) {
    console.error(labelDef, e);
  }
  return '-label error-';
}

export function texting(templateString: string, parameters: SRecord = {}) {
  parameters = parameters || {};
  for (const [key, value] of Object.entries(parameters)) {
    if (value !== undefined) {
      const r = new RegExp('\\:' + key + '\\b', 'g');
      templateString = templateString.replace(r, value.toString());
    }
  }
  return templateString;
}

export function registerUiType(uiType: object | string, uiFun?: any) {
  if (typeof uiType === 'object') {
    Object.entries(uiType).forEach(([uiType, uiFun]) => (WIDGET_MAP[uiType] = uiFun));
  } else {
    WIDGET_MAP[uiType] = uiFun;
  }
  return WIDGET_MAP;
}

export function resolveUiType(uiType: string | FC<WithTTDefProp>) {
  if (typeof uiType === 'function') {
    return uiType;
  }
  return WIDGET_MAP[uiType];
}

export function registerTtDefs(ttdefs: TtDef | TtDef[] | Record<string, TtDef>) {
  if (isTtDef(ttdefs)) {
    TT_DEF_MAP[ttdefs.name] = ttdefs;
  } else if (Array.isArray(ttdefs)) {
    ttdefs.forEach((def) => (TT_DEF_MAP[def.name] = def));
  } else {
    Object.keys(ttdefs).forEach((key) => (TT_DEF_MAP[key] = ttdefs[key]));
  }
}

export function resolveTtDef(name: string) {
  return TT_DEF_MAP[name];
}

export async function processAction(actionIn: ActionDef, parameters: SRecord = {}): Promise<Result> {
  const newAction = { ...actionIn, parameters: { ...actionIn.parameters, ...parameters } };
  let result: Result;
  try {
    if (typeof newAction.service === 'function') {
      result = await newAction.service(newAction);
    } else if (newAction.serviceId) {
      result = await processService(newAction.serviceId, newAction.parameters);
    } else {
      result = toResult([parameters]);
    }
    if (newAction.postProcessing) {
      result = newAction.postProcessing(result);
    }
  } catch (err) {
    const e = err as Error;
    result = { exception: e.message ? e.message : 'Unknown Error' };
  }
  return result;
}

export function sameKey(keyNames: string[], data1: SRecord | undefined, data2: SRecord | undefined) {
  if (data1 === undefined || data2 === undefined || keyNames.length === 0) {
    return false;
  }
  for (const key of keyNames) {
    if (data1[key] !== data2[key]) {
      return false;
    }
  }
  return true;
}

export function createKey(value: Record<string, any>, ttdef: TtDef) {
  return ttdef.attributes.reduce((acc, att) => (att.isKey ? acc + value[att.name] : acc), '');
}
