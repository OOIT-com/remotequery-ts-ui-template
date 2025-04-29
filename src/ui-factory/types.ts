import { IconName } from './uis';
import { jsx } from '@emotion/react';
import { PRecord, Result, SRecord } from 'remotequery-ts-common';
import { FC, ReactNode } from 'react';
import { NavigationContextType } from './components/navigation/NavigationProvider';
import JSX = jsx.JSX;

export type BuiltInForward = 'close' | 'exit' | 'back';

export type SnValue = string | number;

export type SetFun<T = string> = (t: T) => void;
export type SetNameFun<T = string> = (name: string, t: T) => void;
export type InitState = {
  filterInitDone: boolean;
};

export type TtReduxState = {
  loadingMessage?: string;
  userInfo: UserInfo;
  initState: Partial<InitState>;
  menu: string;
  exception: string;
  dataMap: Record<string, any>;
  uiMap: Record<string, any>;
};

export type PageUiTypes = 'list-page' | 'detail-page';

export type AttributeUiTypes = string;

export type WithTTDefProp = { ttDef: TtDef };
export type ActionUiTypeProps = { def: ActionDef; result: Result };

export interface TtDef<NAMES = string, TUT = PageUiTypes> {
  name: string;
  labelId?: string;
  label?: string;
  description?: string;
  accessRoles?: string[];
  uiType: TUT | FC<WithTTDefProp>;
  uiTypeOptions?: UiTypePageOptions;
  attributes: AttributeDef<NAMES>[];
  actions: ActionDef[];
}

export interface SelectValue {
  name?: string;
  value?: string;
  code?: string;
  label?: string;
  labelId?: string;
}

export interface UiTypePageOptions<T = any> {
  noFilters?: boolean;
  resizable?: boolean;
  // ag grid
  useQuickFilter?: boolean;
  misc?: T;
  withFilter?: boolean;
  numberOfColumns?: number;
  excelDownload?: boolean;
  layout?: 'row';
}

export interface UiTypeOptions<T = any> {
  serviceId?: string;
  parameters?: SRecord;
  selectList?: SelectValue[];
  onValue?: string;
  offValue?: string;
  accept?: string;
  fileTypes?: string[];
  uploadButtonLabel?: string;
  noFilters?: boolean;
  resizable?: boolean;
  dataType?: 'number' | 'date' | 'string';
  // ag grid
  misc?: T;

  codeTable?: string;
  withFilter?: boolean;
  dependentParameter?: string;
  columnSpan?: number;
  excelDownload?: boolean;
  layout?: 'row';
}

export interface LabelDef {
  name?: string;
  label?: string;
  labelId?: string;
  description?: string;
  mandatory?: boolean;
  isKey?: boolean;
  value?: SRecord;
  noLabel?: boolean;
}

export type DynamicBooleanAttributeValue = string | boolean | ((cx: SRecord) => boolean);

export type FormatterFun = (value: string) => string;
export type CellRendererFun = ({ data, attribute }: { data: SRecord; attribute: AttributeDef }) => ReactNode;
export type UiMode = 'desktop' | 'mobile';

export interface AttributeDef<NAMES = string> {
  name: NAMES;
  labelId?: string;
  label?: string;
  description?: string;
  mandatory?: boolean;
  isKey?: boolean;
  noLabel?: boolean;
  uiSection?: string;
  uiType?: AttributeUiTypes;
  uiTypeOptions?: UiTypeOptions;
  inputType?: 'text' | 'number' | 'password';
  editable?: DynamicBooleanAttributeValue;
  visible?: DynamicBooleanAttributeValue;
  hidden?: boolean;
  width?: number;
  minWidth?: number;
  height?: number;
  filter?: string | boolean;
  remoteFilter?: 'startWith' | 'contains';
  noColumnLabel?: boolean;
  className?: 'tt-number' | 'tt-right' | string;
  formatter?: FormatterFun;
  cellRenderer?: CellRendererFun;
  cellRendererParams?: SRecord;
  sortable?: boolean;
  multiline?: boolean;
  maxRows?: number;
  defaultValue?: string;
  filterInitValue?: string;
  uiMode?: UiMode;
}

export interface ServiceRequest {
  serviceId: string;
  parameters?: PRecord;
}

export type ActionParameters = PRecord | ((context: NavigationContextType) => SRecord);
export type ServiceFun = (actionDef: ActionDef) => Promise<Result>;

export interface ActionDef {
  name: string;
  label?: string;
  description?: string;
  icon?: IconName;
  source?: 'rowSelect' | 'rowRight' | 'toolbar';
  forward?: string;
  options?: ActionOptions;
  serviceId?: string;
  service?: ServiceFun;
  parameters?: ActionParameters;
  postProcessing?: (result: Result) => Result;
  enabled?: string | boolean | (({ cx, data }: { cx: SRecord; data: SRecord }) => boolean);
  confirmation?: string;
  visible?: boolean | ((data: SRecord) => boolean);
  ResultUi?: (props: ActionUiTypeProps) => JSX.Element;
}

export interface ActionOptions {
  forwardDisplay?: 'dialog';
}

export type ProcessLineState = 'Error' | 'System' | 'OK' | 'Warning';

export type ProcessLine = {
  msg: string;
  time: number;
  state: ProcessLineState;
  msgCode: number;
  type: 'string';
};
export type ProcessInfo = {
  state: ProcessLineState;
  processLines: ProcessLine[];
};

export type ResultNotEmpty = Result & {
  table: string[][];
  header: string[];
};

export const isServiceDataNotEmpty = (result: Result): result is ResultNotEmpty => {
  return Array.isArray(result.table) && Array.isArray(result.header);
};

export type WidgetActionFun = (source: 'value' | 'blur', value: SRecord) => void;
export type WidgetValueActionFun<V = string> = (value: V) => void;
export type WidgetProps<V = string> = {
  def: AttributeDef;
  value: V;
  cx?: SRecord;
  action?: WidgetActionFun;
  valueAction?: WidgetValueActionFun<V>;
};

export type UserInfo = {
  userId: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
  env?: string;
  sessionId?: string;
};

export type CallApi = (serviceId: string, parameters: PRecord) => Promise<Result>;
export type Label = {
  name: string;
  label: string;
  description: string;
};
export type LabelMap = Record<string, Label>;

export type CodeTableEntries = {
  tableName: string;
  name: string;
  indx: string;
  ord: string;
  svalue: string;
  label: string;
  description: string;
};

export type CodeTablesMap = Record<string, CodeTableEntries[]>;

export type ServiceDataSetter = (result: Result) => void;

export type NotifyFun = () => void;
export type RValue = number | string;
