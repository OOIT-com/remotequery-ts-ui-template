import { AttributeDef, ListPageUi, TtDef } from '../ui-factory';
import React from 'react';
import { Result } from 'remotequery-ts-common';

export function ResultDataTable({ header = [], table, name, title }: Result & { name: string; title: string }) {
  const result = { header, table };
  const attributes: AttributeDef[] = header.map((head) => ({
    name: head,
    filter: true
  }));
  const agDef: TtDef = {
    name,
    label: title || name,
    uiType: 'list-page',
    actions: [],
    attributes,
    uiTypeOptions: { useQuickFilter: true }
  };

  return <ListPageUi ttDef={agDef} result={result} height={'50vh'} />;
}
