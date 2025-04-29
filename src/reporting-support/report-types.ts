import React from 'react';
import { ActionDef, AttributeDef, FormatFun, GetLabelFun, ResultNotEmpty, RValue } from '../ui-factory';
import { SRecord } from 'remotequery-ts-common';

interface RAttributDef extends AttributeDef {
  dParameter?: boolean;
}

export type ReportResultUiProps = {
  data: ResultNotEmpty;
  cxRow?: SRecord;
  def: TTReportNormalized;
};

export interface TTReport {
  name: string;
  title?: string;
  label?: string;
  description?: string;

  role?: string;

  rAttributes?: RAttributDef[];
  serviceId?: string;

  attributesList?: RDef[];

  parameterDisplay?: string[];

  layout?: RLayout;
  columnNamePrefix?: string;
  headerMode?: 'sqlHeader';
  cellWidths?: number[];
  defaultCellWidth?: number;
  columnFunctions?: RColumnFunction[];
  textAligns?: ('left' | 'right')[];
  sumRow?: RSumFunction[];
  pdf?: boolean;
  spreadsheet?: boolean;
  filename?: string;
  pageSize?: RPageSize;
  pagination?: boolean;
  filters?: boolean;
  version?: 2;
  ResultUi?: React.FC<ReportResultUiProps>;
  dataFilter?: any;
}

export type RDef = {
  name: string;
  label?: string;
  attributes: RAttributDef[];
  actions: ActionDef[];
};

export interface TTReportNormalized extends TTReport {
  cellWidths: number[];
  columnFunctions: RColumnFunction[];
  textAligns: RAlign[];
  columnNamePrefix: string;
  defaultCellWidth: number;
  sumRow: RSumFunction[];
  hasSumRow: boolean;
  layout: RLayout;
  title: string;
  label?: string;
  pageSize: 'A4';
  attributesList: RDef[];
}

export type RColumnFunction = NamedFunNames | FormatFun;
export type RSumFunction = 'empty' | 'sum';
export type RAlign = 'left' | 'right';
export type RLayout = 'landscape' | 'portrait';
export type RPageSize = 'A4';

export interface DData {
  header: DHeader[];
  table: (DRow | DSumRow)[];
}

export interface DRequest {
  dServiceId: string;
  dParameters: DParameter[];
}

interface DParameter {
  name: string;
  value?: string;
  label?: string;
}

export interface DHeader {
  name: string;
  label?: string;
  description?: string;
  width?: number;
}

export interface DCell {
  value?: string;
  formatted: string;
  align?: RAlign;
}

export type DRow = DCell[];

export interface ReportPartArgs {
  def: TTReportNormalized;
  data: ResultNotEmpty;
  serviceId?: string;
  parameters?: SRecord;
  L: (arg: any) => string;
  D: (arg: any) => string;
}

export interface DSumCell {
  values: string[];
  value: RValue;
  formatted: string;
  align: RAlign;
  calcFunName: RSumFunction;
}

export type DSumRow = DSumCell[];

export function isDSumCell(e: any): boolean {
  return !!e.calcFunName;
}

export interface ReportPart {
  name: string;
  title?: string;
  description?: string;
  dData: DData;
  dRequest?: DRequest;
}

export interface DocumentDef {
  title: string;
  layout: RLayout;
  filename: string;
  parts: ReportPart[];
  footerMiddle?: string;
  logoBase64Url?: string;
  pageSize?: RPageSize;
}

export type NamedFun = (value: RValue, L: GetLabelFun) => RValue;
export type NamedFunNames = 'id' | 'fixed' | 'fixed2' | 'hidden';
