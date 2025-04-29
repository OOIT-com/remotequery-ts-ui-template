import React, { ReactNode, useEffect, useState } from 'react';
import {
  ActionDef,
  AttributeDef,
  dispatchLoading,
  errorMessage,
  Header,
  infoMessage,
  LabelDef,
  NotifyFun,
  processService,
  RenderAction,
  renderWidget,
  ResultNotEmpty,
  StatusMessage,
  StatusMessageElement,
  TitleElement,
  useLabels
} from '../ui-factory';
import { Box, Button, Grid, Stack } from '@mui/material';
import { TTReportNormalized } from './report-types';
import { useTheme } from '@mui/material/styles';
import { ResultAgGridUi } from './ResultAgGridUi';

import { Result, SRecord } from 'remotequery-ts-common';

import { useNavigationContext } from '../ui-factory/components/navigation/navigation-utils';

type ReportData = {
  data: Result;
  index: number;
  actionDef: ActionDef;
};

let _key = 0;
const key = () => 'K-' + _key++;

export default function ReportUi({ def, done }: Readonly<{ def: TTReportNormalized; done: NotifyFun }>) {
  const theme = useTheme();
  const context = useNavigationContext();
  const { l } = useLabels();
  const [statusMessage, setStatusMessage] = useState<StatusMessage>();
  const [dirty, setDirty] = useState(false);
  const [reportData, setReportData] = useState<ReportData>();

  const [defaultValuesList, setDefaultValuesList] = useState<SRecord[]>([]);

  // let attributesList: RDef[] = def.attributesList || [
  //   {
  //     name: def.name,
  //     attributes: def.rAttributes ?? [],
  //     actions: [singleAction],
  //     ResultUi: def.ResultUi
  //   }
  // ];
  const attributesList = def.attributesList;
  const isSingle =
    attributesList.length === 1 && attributesList[0].attributes.length === 0 && attributesList[0].actions.length === 1;
  const singleAction: ActionDef = attributesList[0].actions[0];

  useEffect(() => {
    const valuesList = attributesList.map((rDef) =>
      rDef.attributes.reduce<SRecord>((acc, e) => ({ ...acc, [e.name]: e.defaultValue ?? '' }), {})
    );
    setDefaultValuesList(valuesList);
  }, [attributesList]);

  const colWidth = 12 / attributesList.length;
  return (
    <Stack className={theme.palette.mode === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz'} spacing={1}>
      <Stack
        key={'title-row'}
        sx={{ borderBottom: '1px gray solid' }}
        direction={'row'}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        {!isSingle && <TitleElement def={def as LabelDef} cx={{}} dirty={dirty} />}

        {isSingle && (
          <RenderAction
            key={key()}
            actionDef={singleAction}
            action={() => processReportAction(singleAction, 0)}
            variant={'text'}
            cx={context.getCx(def.name)}
          />
        )}

        <Button onClick={() => done()}>{l('Close')}</Button>
      </Stack>
      {!isSingle && (
        <Grid container={true} spacing={2}>
          {attributesList.map((rAttributes, index) => (
            <Grid
              key={`${rAttributes.name}-${index}`}
              xs={colWidth}
              item
              sx={{
                paddingLeft: index === 0 ? '0 !important' : undefined
              }}
            >
              <Stack
                key={'column'}
                sx={{
                  height: '100%',
                  border: 'solid 1px lightGray',
                  padding: '0.4em',
                  boxSizing: 'border-box'
                }}
                direction="column"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                {attributesList.length > 0 && <Header level={3} content={l(rAttributes)} />}
                <Stack key={'attributes'} direction={'column'} spacing={2} sx={{ width: '100%' }}>
                  {rAttributes.attributes.map((attDef) => renderAttribute(attDef, index))}
                </Stack>
                <Box
                  key={'actions'}
                  //direction={'row'} spacing={1} padding={1}
                >
                  {rAttributes.actions.map((actionDef: ActionDef) => (
                    <RenderAction
                      key={key()}
                      actionDef={actionDef}
                      action={() => processReportAction(actionDef, index)}
                      variant={'text'}
                      cx={context.getCx(def.name)}
                    />
                  ))}
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>
      )}

      <StatusMessageElement
        sx={{ margin: '1em' }}
        statusMessage={statusMessage}
        onClose={() => setStatusMessage(undefined)}
      />
      {/*// REPORT RESULT*/}
      <Stack sx={{ margin: '1em', borderTop: '2px solid gray', paddingTop: '0.6em' }}>
        <RenderReportResult
          def={def}
          reportData={reportData}
          filterValues={defaultValuesList[reportData?.index || 0] || {}}
        />
      </Stack>
    </Stack>
  );

  function renderAttribute(attDef: AttributeDef, index: number): ReactNode {
    return (
      <Box key={attDef.name} sx={{ margin: '0' }}>
        {renderWidget({
          def: attDef,
          value: (defaultValuesList[index] || {})[attDef.name],
          cx: defaultValuesList[index] || {},
          action: (cmd, value) => widgetAction(cmd, value, index)
        })}
      </Box>
    );
  }

  function widgetAction(cmd: string | ActionDef, value: Record<string, any>, index: number) {
    switch (cmd) {
      case 'value': {
        setDefaultValuesList((l) => {
          const l0 = [...l];
          l0[index] = { ...(l0[index] || {}), ...value };
          return l0;
        });
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

  async function processReportAction(actionDef: ActionDef, index: number) {
    try {
      dispatchLoading('Processing Report...');
      setStatusMessage(undefined);
      setReportData(undefined);
      const data = await processService(actionDef.serviceId || '', { ...defaultValuesList[index] });
      if (data.exception) {
        setStatusMessage(errorMessage(`${l('Exception occurred')} ${data.exception}`));
        return;
      }
      if (data.table && data.table.length > 0) {
        setReportData({ data, index, actionDef });
      } else {
        setStatusMessage(infoMessage('sorry-no-data-found'));
      }
    } finally {
      dispatchLoading('');
    }
  }
}

function RenderReportResult({
  def,
  reportData,
  filterValues
}: Readonly<{
  def: TTReportNormalized;
  reportData?: ReportData;
  filterValues: SRecord;
}>) {
  if (!reportData || !reportData.data) {
    return <></>;
  }
  const { data, actionDef } = reportData;
  if (!data?.table || !data.table[0] || !data.header) {
    return <></>;
  } else {
    const data0: ResultNotEmpty = data as ResultNotEmpty;
    if (actionDef.ResultUi) {
      return <actionDef.ResultUi def={actionDef} result={data0} />;
    }
    return <ResultAgGridUi def={def} cxRow={filterValues} data={data0} />;
  }
}
