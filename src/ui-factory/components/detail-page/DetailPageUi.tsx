import React, { FC, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { RenderAction, renderWidget } from '../../uis';

import { ActionDef, AttributeDef, TtDef, WidgetActionFun } from '../../types';
import { Box, Stack } from '@mui/material';

import { processAction, resolveBoolean2 } from '../../tabletool-utils';
import { useTheme } from '@mui/material/styles';
import { isStatusMessage, StatusMessage, StatusMessageElement } from '../../status-message';
import { TitleElement, UiSection } from '../utils-elements';

import { ColumnsLayout } from './ColumnsLayout';
import { processDetailAction } from './detail-page-utils';
import { Result, SRecord, toFirst } from 'remotequery-ts-common';
import { useUserInfo } from '../../redux';

import { useNavigationContext } from '../navigation/navigation-utils';

const useDebug = () => {
  useEffect(() => {
    console.log('cxValue', '..');
  }, []);
};

export const DetailPageUi: FC<{ ttDef: TtDef }> = ({ ttDef }) => {
  const theme = useTheme();
  const context = useNavigationContext();
  useDebug();
  const userInfo = useUserInfo();
  const USERID = userInfo.userId || '';
  const [statusMessage, setStatusMessage] = useState<StatusMessage>();
  const [dirty, setDirty] = useState(false);

  const { getCx, updateData, getData } = context;
  const cxIn = getCx(ttDef.name);
  const cx: SRecord = useMemo(() => ({ USERID, ...cxIn }), [USERID, cxIn]);
  const dataIn = getData(ttDef.name);
  const data: SRecord = useMemo(() => ({ ...cx, ...dataIn }), [cx, dataIn]);

  const actions = ttDef.actions || [];
  const refreshAction = actions.filter((actionDef: ActionDef) => actionDef.forward === 'refresh')[0];

  const toolbarActions = actions.filter((action) => action.source === 'toolbar');
  const detailActions = actions.filter((action) => action.source !== 'toolbar');

  useEffect(() => {
    const _run = async () => {
      const defaultValues: SRecord = {};
      ttDef.attributes.forEach((a) => {
        if (a.defaultValue) {
          defaultValues[a.name] = a.defaultValue;
        }
      });
      const initData = { ...defaultValues, ...cx };

      if (refreshAction) {
        const result = await processAction(refreshAction, initData);
        const newData = toFirst(result) || {};
        updateData(ttDef.name, { ...initData, ...newData });
      } else {
        updateData(ttDef.name, { ...initData });
      }
    };
    _run().catch(console.error);
  }, [ttDef.attributes, refreshAction, ttDef.name, cx, updateData]);

  const setResult = useCallback(
    (result: Result) => {
      const newData = toFirst(result);
      if (newData) {
        updateData(ttDef.name, newData);
      }
    },
    [ttDef, updateData]
  );

  const uiSectionUsed = new Set<string>();

  const numberOfColumns = ttDef.uiTypeOptions?.numberOfColumns;

  return (
    <Stack
      direction={'column'}
      spacing={1}
      className={theme.palette.mode === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz'}
    >
      <Box
        component={'h4'}
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 0fr'
        }}
      >
        <TitleElement def={ttDef} cx={data} dirty={dirty} />
        <Stack direction={'row'} spacing={1}>
          {toolbarActions.map((actionDef: ActionDef) => (
            <RenderAction
              key={actionDef.name ?? ''}
              actionDef={actionDef}
              cx={cx}
              data={data}
              action={() =>
                processDetailAction(data, actionDef, context, setResult).then((res) => {
                  if (isStatusMessage(res)) {
                    setStatusMessage(res);
                  }
                })
              }
            />
          ))}
        </Stack>
      </Box>

      <ColumnsLayout
        numberOfColumns={numberOfColumns}
        elements={ttDef.attributes
          .map((attDef, index: number) => {
            const { uiSection, name } = attDef;

            const list = [];
            if (uiSection && !uiSectionUsed.has(uiSection)) {
              uiSectionUsed.add(uiSection);
              list.push({
                key: uiSection,
                columnSpan: numberOfColumns,
                content: <UiSection content={uiSection} />
              });
            }
            list.push({
              key: name,
              columnSpan: Math.max(1, attDef.uiTypeOptions?.columnSpan ?? 0),
              content: renderAttribute(attDef, index, widgetAction, data)
            });
            return list;
          })
          .flat()}
      />

      <StatusMessageElement statusMessage={statusMessage} onClose={() => setStatusMessage(undefined)} />

      <Stack direction={'row'} spacing={1} padding={1}>
        {detailActions.map((actionDef: ActionDef) => (
          <RenderAction
            key={actionDef.name || ''}
            actionDef={actionDef}
            cx={cx}
            data={data}
            action={() =>
              processDetailAction(data, actionDef, context, setResult).then((res) => {
                if (isStatusMessage(res)) {
                  setStatusMessage(res);
                }
              })
            }
            variant={'contained'}
          />
        ))}
      </Stack>
    </Stack>
  );

  function widgetAction(cmd: string | ActionDef, value: SRecord) {
    if (typeof cmd === 'object') {
      processAction(cmd, value).catch(console.error);
    }
    switch (cmd) {
      case 'value': {
        updateData(ttDef.name, { ...data, ...value });
        setDirty(true);
        break;
      }
      case 'dirty': {
        setDirty(true);
        break;
      }
      default:
    }
  }
};

export function renderAttribute(
  attDef: AttributeDef,
  index: number,
  action: WidgetActionFun,
  cxRow: SRecord
): ReactElement {
  const cx = cxRow;
  const visible = resolveBoolean2(attDef.visible ?? true, cx);
  if (visible) {
    return (
      <Box key={index} sx={{ margin: '0.6em 0 0.4em 0' }}>
        {renderWidget({
          def: attDef,
          value: cxRow[attDef.name],
          cx,
          action
        })}
      </Box>
    );
  }
  return <></>;
}
