import { TtDef, UserInfo } from '../ui-factory';
import { ReactElement, ReactNode } from 'react';

export type TtDefFun = (userInfo: UserInfo) => TtDef;

export interface TtMenuApp {
  name: string;
  icon: ReactNode;
  label?: string | (() => ReactElement);
  description?: string;
  // Roles
  roles: string[];
  // Content
  content?: TtMenuTab[] | TtDef | TtDefFun | (() => ReactElement);
  menuTabs?: TtMenuTab[];
  ttDef?: TtDef | TtDefFun;
  Ui?: () => ReactElement;
}

export const isTtMenuTab = (arg: any): arg is TtMenuTab => arg && typeof arg === 'object' && Array.isArray(arg);

export type MenuAppListFun = (userInfo: UserInfo) => Promise<TtMenuApp[]>;

export interface TtMenuTab {
  name: string;
  roles?: string[];
  label?: string;
  icon?: ReactNode;
  // Content
  menuSections?: TtMenuSection[];
  ttDef?: TtDef;
  Ui?: () => ReactElement;
}

export type TtMenuSection = {
  name: string;
  roles?: string[];
  label?: string;
  icon?: ReactNode;
  colIndex: number;
  // Content
  ui?: () => ReactElement;
  menuEntries?: (TtMenuEntry | TtDef)[];
};

// TODO might replaced with TtDef
export type TtMenuEntry = {
  name: string;
  label?: string;
  title?: string;
  icon?: ReactNode;
};

export type AuthData = {
  userId: string;
  roles: string;
  sessionId: string;
};
