// eslint-disable-next-line no-debugger
//
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { RenderAction } from '../../uis';
import { sameKey, ttLabel } from '../../tabletool-utils';
import { ActionDef, TtDef } from '../../types';

import { AgGridReact } from 'ag-grid-react';
import zipcelx, { ZipCelXConfig } from 'zipcelx';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  Box,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import {
  ArrowForwardOutlined,
  ClearOutlined,
  DownloadOutlined,
  ExpandOutlined,
  FilterAltOutlined,
  FitScreenOutlined,
  SearchOutlined,
  ViewColumnOutlined
} from '@mui/icons-material';
import {
  ColDef,
  ColumnState,
  FilterChangedEvent,
  FilterModifiedEvent,
  GridApi,
  GridReadyEvent,
  GridSizeChangedEvent,
  IRowNode
} from 'ag-grid-community';
import { isSRecord } from '../../util/typeGuard';
import { toZipcelxData } from '../../util/zipcelxUtil';
import FileSaver from 'file-saver';
import { dispatchInitState, TitleElement, useInitState, usePaletteMode } from '../..';
import { RemoteFilterDialog } from './RemoteFilterDialog';
import {
  clearFilters,
  createDefaultColDef,
  localFilterIsEmpty,
  processFilterInitValues,
  processRowAction
} from './ag-grid-utils';
import { RightColumnCellRenderer } from './RightColumnCellRenderer';
import { ColumnSelection, ColumnSelectionType } from './ColumnSelection';
import { errorMessage, infoMessage, StatusMessageElement } from '../../status-message';
import {
  getFilterModel,
  getPaginationSize,
  getResizeMode,
  processToolbarAction,
  savedFilterModel,
  savePaginationSize,
  saveResizeMode
} from './list-page-utils';
import { activatedColor } from '../style-utils';

import { Result, SRecord, toList } from 'remotequery-ts-common';
import { RowClassParams } from 'ag-grid-community/dist/types/core/entities/gridOptions';
import { PaginationChangedEvent, RowClickedEvent } from 'ag-grid-community/dist/types/core/events';
import { createColumnDefs } from './create-column-defs';
import './style.css';
import { useNavigationContext } from '../navigation/navigation-utils';

type ModalType = 'columnSelection' | 'remoteFilterDialog' | 'afterRemoteSearch' | '';

export interface AgGridOptions {
  pagination?: boolean;
  filters?: boolean;
}

type ListPageUiProps = {
  ttDef: TtDef;
  result?: Result;
  height?: string;
  pinnedRowIndex?: number;
  agGridOptions?: AgGridOptions;
};

const emptyAction: ActionDef[] = [];

export const ListPageUi: FC<ListPageUiProps> = ({
  ttDef,
  result,
  height = '80vh',
  pinnedRowIndex,
  agGridOptions = {}
}) => {
  const context = useNavigationContext();
  const { getSelected, getCx, getRemoteFilter } = context;

  const cx = getCx(ttDef.name);
  const selectedRow = getSelected(ttDef.name);
  const remoteFilter = useMemo(() => getRemoteFilter(ttDef.name) || {}, [ttDef, getRemoteFilter]);
  const resizeMode = getResizeMode(ttDef.name);

  const actions = useMemo(() => ttDef.actions || emptyAction, [ttDef.actions]);

  const refreshAction = useMemo(
    () => actions.filter((actionDef: ActionDef) => actionDef.forward === 'refresh')[0],
    [actions]
  );

  const toolbarActions = useMemo(
    () => actions.filter((actionDef: ActionDef) => actionDef.source === 'toolbar'),
    [actions]
  );

  const rowSelectActions = useMemo(
    () => actions.filter((actionDef: ActionDef) => actionDef.source === 'rowSelect'),
    [actions]
  );

  const rowRightActions = useMemo(
    () => actions.filter((actionDef: ActionDef) => actionDef.source === 'rowRight'),
    [actions]
  );

  // filter
  const initState = useInitState();

  const hasRemoteFilter = ttDef.attributes.filter((a) => !!a.remoteFilter).length > 0;
  const hasFilter = ttDef.attributes.findIndex((a) => !!a.filter) !== -1;
  const useQuickFilter = !!ttDef.uiTypeOptions?.useQuickFilter;

  const [modal, setModal] = useState<ModalType>('');
  const [showRowActions, setShowRowActions] = useState<false | SRecord>(false);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [data, setData] = useState<Result>();
  const [rowData, setRowData] = useState<SRecord[]>([]);
  const [pinnedRowData, setPinnedRowData] = useState<SRecord[]>();
  const [exception, setException] = useState('');
  const [config, setConfig] = useState<ZipCelXConfig | undefined>();
  const [gridApi, setGridApi] = useState<GridApi>();
  const [isLocalFilter, setIsLocalFilter] = useState(false);
  const keyNames = useMemo(() => ttDef.attributes.filter((a) => !!a.isKey).map((a) => a.name), [ttDef]);
  const headerLabels = useMemo(
    () =>
      ttDef.attributes.reduce<Record<string, string>>((acc, att) => {
        acc[att.name] = ttLabel(att);
        return acc;
      }, {}),
    [ttDef]
  );

  const setDataAndConfig = useCallback(
    (serviceDataIn: Result) => {
      setData(serviceDataIn);
      setConfig(toZipcelxData(ttDef, serviceDataIn));
      const rowData0 = toList<SRecord>(serviceDataIn);

      if (typeof pinnedRowIndex === 'number') {
        const pinnedRowData0 = rowData0.splice(pinnedRowIndex, 1);
        setPinnedRowData(pinnedRowData0);
      }
      setRowData(rowData0);
    },
    [pinnedRowIndex, ttDef]
  );

  useEffect(() => {
    if (result) {
      setDataAndConfig(result);
    }
  }, [result, setDataAndConfig]);

  useEffect(() => {
    if (refreshAction) {
      processToolbarAction(ttDef, refreshAction, setDataAndConfig, cx, context).catch(console.error);
      setModal('afterRemoteSearch');
    }
  }, [ttDef, remoteFilter, context, cx, setDataAndConfig, refreshAction]);

  useEffect(() => {
    if (!initState.filterInitDone && gridApi) {
      processFilterInitValues(ttDef, gridApi);
      dispatchInitState({ ...initState, filterInitDone: true });
    }
  }, [initState, gridApi, ttDef]);

  const getRowStyle = useCallback((params: RowClassParams) => {
    if (params.node.rowPinned) {
      return { fontWeight: 'bold' };
    }
  }, []);

  const onGridReady = useCallback(
    ({ api }: GridReadyEvent<SRecord>) => {
      setGridApi(api);
      api.forEachNode((node: IRowNode) => {
        if (sameKey(keyNames, node.data, selectedRow)) {
          node.setSelected(true);
          api.ensureNodeVisible(node);
        }
      });

      const filterModel = getFilterModel(ttDef.name);
      if (filterModel) {
        api.setFilterModel(filterModel);
        api.onFilterChanged();
      }
    },
    [keyNames, selectedRow, ttDef.name]
  );

  const onGridSizeChanged = useCallback(
    ({ api }: GridSizeChangedEvent<SRecord>) => {
      if (resizeMode === 'sizeToFit') {
        api.sizeColumnsToFit();
      }
      if (resizeMode === 'autoSizeAll') {
        api.autoSizeAllColumns();
      }
    },
    [resizeMode]
  );

  const onRowClicked = useCallback(
    ({ data, node }: RowClickedEvent<SRecord>) => {
      if (rowSelectActions.length && data) {
        if (rowSelectActions.length > 1) {
          setShowRowActions(data);
        } else {
          processRowAction({
            name: ttDef.name,
            actionDef: rowSelectActions[0],
            row: data,
            setDataAndConfig,
            context
          }).then(() => {
            node.setSelected(true);
          });
        }
      }
    },
    [rowSelectActions, ttDef, context, setDataAndConfig]
  );

  const onPaginationChanged = useCallback(
    ({ api, newPageSize }: PaginationChangedEvent<SRecord>) => {
      if (newPageSize !== undefined) {
        const currentPageSize = api.paginationGetPageSize();
        savePaginationSize(currentPageSize, ttDef.name);
      }
    },
    [ttDef.name]
  );

  const onFilterModified = useCallback(({ api }: FilterModifiedEvent<SRecord>) => {
    setIsLocalFilter(!localFilterIsEmpty(api));
  }, []);

  const onFilterChanged = useCallback(
    ({ api }: FilterChangedEvent) => {
      const filterModel = api.getFilterModel();
      savedFilterModel(ttDef.name, filterModel);
    },
    [ttDef]
  );

  const rightColumnActionCellRenderer = useCallback(
    ({ data }: { data: SRecord }) => (
      <RightColumnCellRenderer
        name={ttDef.name}
        rowRightActions={rowRightActions}
        context={context}
        data={data}
        setDataAndConfig={setDataAndConfig}
      />
    ),
    [ttDef, setDataAndConfig, context, rowRightActions]
  );

  const columnDefs: ColDef[] = useMemo(
    () => createColumnDefs(ttDef, rightColumnActionCellRenderer),
    [ttDef, rightColumnActionCellRenderer]
  );
  const defaultColDef = useMemo(() => createDefaultColDef(ttDef), [ttDef]);

  const message = rowData.length === 0 && !data?.table ? '...' : '';

  const columns = useMemo(
    () =>
      gridApi?.getColumnState()?.map((e: ColumnState) => ({
        colId: e.colId || '',
        hide: e.hide ?? undefined
      })) ?? [],
    [gridApi]
  );
  const paletteMode = usePaletteMode();

  return (
    <div
      className={`ag-theme-quartz${paletteMode === 'dark' ? '-dark' : ''}`}
      style={{
        display: 'grid',
        gridTemplateRows: '0fr 0fr 1fr',
        height
      }}
    >
      <ColumnSelection
        open={modal === 'columnSelection'}
        onClose={() => setModal('')}
        columns={columns}
        setColumns={(columns: ColumnSelectionType[]) => {
          if (gridApi) {
            const savedState = gridApi.getColumnState().map((c: ColumnState) => ({
              ...c,
              hide: columns.filter((col) => col.colId === c.colId)[0]?.hide
            }));
            gridApi.applyColumnState({ state: savedState });
          }
        }}
        headerLabels={headerLabels}
      />

      <RemoteFilterDialog open={modal === 'remoteFilterDialog'} onClose={() => setModal('')} ttDef={ttDef} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 8em 0fr'
        }}
      >
        <Box>
          <TitleElement def={ttDef} cx={cx} />
        </Box>
        <Box />
        <ButtonGroup variant="text">
          {toolbarActions.map((actionDef) => (
            <RenderAction
              key={actionDef.name}
              actionDef={actionDef}
              cx={cx}
              action={() => processToolbarAction(ttDef, actionDef, setDataAndConfig, cx, context)}
            />
          ))}
        </ButtonGroup>
      </Box>
      {renderMainContent()}

      <Dialog open={!!showRowActions} onClose={() => setShowRowActions(false)}>
        <DialogTitle>Select Action</DialogTitle>
        <DialogContent>
          <List sx={{ pt: 0 }}>
            {rowSelectActions.map((actionDef, index) => (
              <ListItemButton
                key={index + actionDef.name}
                onClick={() => {
                  if (isSRecord(showRowActions)) {
                    processRowAction({
                      name: ttDef.name,
                      actionDef,
                      row: showRowActions,
                      setDataAndConfig,
                      context
                    }).catch(console.error);
                  }
                  setShowRowActions(false);
                }}
                dense
              >
                <ListItemIcon>
                  <ArrowForwardOutlined />
                </ListItemIcon>
                <ListItemText primary={actionDef.label || actionDef.name} />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );

  function renderMainContent() {
    if (exception) {
      return <StatusMessageElement statusMessage={errorMessage(exception)} onClose={() => setException('')} />;
    }
    if (message) {
      return <StatusMessageElement statusMessage={infoMessage(message)} />;
    }
    return renderCurrentList();
  }

  function renderCurrentList() {
    return (
      <React.Fragment>
        <ButtonGroup sx={{ padding: '0.2em 0' }}>
          {useQuickFilter && (
            <InputBase
              placeholder={'quick search...'}
              startAdornment={
                <InputAdornment position="end">
                  <SearchOutlined />
                </InputAdornment>
              }
              size={'small'}
              type={'search'}
              margin={'none'}
              value={quickFilterText}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const _quickFilterText = event.target.value;
                if (gridApi) {
                  setQuickFilterText(_quickFilterText);
                  gridApi.setGridOption('quickFilterText', _quickFilterText);
                }
              }}
            />
          )}

          {hasFilter && (
            <Tooltip key={'clearFilters'} title="Clear filter" placement="bottom-end">
              <IconButton
                onClick={() => clearFilters(ttDef.name, gridApi, setQuickFilterText, context)}
                sx={{ position: 'relative', background: isLocalFilter ? activatedColor : undefined }}
              >
                <FilterAltOutlined fontSize={'inherit'} />
                <ClearOutlined
                  fontSize={'inherit'}
                  style={{
                    position: 'absolute',
                    fontSize: '60%',
                    bottom: '0.6em',
                    right: '0.2em'
                  }}
                />
              </IconButton>
            </Tooltip>
          )}

          {hasRemoteFilter && (
            <Tooltip key={'k_remoteFilter'} title="Remote filter" placement="bottom-end">
              <IconButton
                onClick={() => setModal('remoteFilterDialog')}
                style={{ position: 'relative', color: remoteFilter ? 'red' : undefined }}
              >
                <FilterAltOutlined fontSize={'inherit'} />
                <Box
                  style={{
                    position: 'absolute',
                    fontSize: '60%',
                    bottom: '0.6em',
                    right: '0.2em'
                  }}
                >
                  R
                </Box>
              </IconButton>
            </Tooltip>
          )}

          {(useQuickFilter || hasFilter || hasRemoteFilter) && <Divider orientation="vertical" flexItem />}

          <Tooltip key={'autoSizeAll'} title="Auto size columns" placement="bottom-end">
            <IconButton
              onClick={
                () => {
                  saveResizeMode('autoSizeAll', ttDef.name);
                  gridApi?.autoSizeAllColumns();
                }
                //
              }
            >
              <FitScreenOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip key={'sizeToFit'} title="Size table to fit window" placement="bottom-end">
            <IconButton
              onClick={() => {
                saveResizeMode('sizeToFit', ttDef.name);
                gridApi?.sizeColumnsToFit();
              }}
            >
              <ExpandOutlined style={{ transform: 'rotate(-90deg)' }} />
            </IconButton>
          </Tooltip>
          <Tooltip key={'columnSelection'} title="Select visible columns" placement="bottom-end">
            <IconButton onClick={() => setModal('columnSelection')}>
              <ViewColumnOutlined fontSize={'small'} />
            </IconButton>
          </Tooltip>
          <Tooltip key={'zipcelx'} title="Download Data with Zipcelx" placement="bottom-end">
            <span>
              <IconButton
                disabled={!config}
                onClick={async () => {
                  if (config) {
                    try {
                      const blob = await zipcelx(config);
                      if (blob) {
                        FileSaver.saveAs(blob, `${config.filename}.xlsx`, { autoBom: false });
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  }
                }}
              >
                <DownloadOutlined fontSize={'small'} />
              </IconButton>
            </span>
          </Tooltip>
        </ButtonGroup>

        <div className={'tt-list-ui'}>
          <AgGridReact
            suppressScrollOnNewData={true}
            rowHeight={rowRightActions ? 40 : undefined}
            key={ttDef.name}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            columnDefs={columnDefs}
            rowData={rowData}
            pinnedBottomRowData={pinnedRowData}
            getRowStyle={getRowStyle}
            onFilterChanged={onFilterChanged}
            onRowClicked={onRowClicked}
            pagination={agGridOptions?.pagination !== false}
            rowSelection={'single'}
            paginationPageSize={getPaginationSize(ttDef.name)}
            onPaginationChanged={onPaginationChanged}
            onFilterModified={onFilterModified}
            paginationPageSizeSelector={[20, 50, 100, 200, 1000, 5000]}
            onGridSizeChanged={onGridSizeChanged}
          />
        </div>
      </React.Fragment>
    );
  }
};
