import React, { MouseEvent, useState } from 'react';
import { resolveBoolean2, resolveUiType, texting, ttLabel } from './tabletool-utils';
import { InputUi } from './components/widgets';
import { ActionDef, NotifyFun, WidgetProps } from './types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {
  AddOutlined,
  Close,
  DeleteOutline,
  EditOutlined,
  ExitToApp,
  Home,
  RefreshOutlined
} from '@mui/icons-material/';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import { SRecord } from 'remotequery-ts-common';
import { useLabels } from './redux';
import { Html } from './components/utils-elements/Html';

export type IconName = 'leave' | 'close' | 'delete' | 'edit' | 'home' | 'refresh' | 'new' | 'add' | 'filter' | 'menu';

export function NamedIcon({ iconName }: Readonly<{ iconName: IconName }>) {
  switch (iconName) {
    case 'leave':
      return <ExitToApp />;
    case 'close':
      return <Close />;
    case 'delete':
      return <DeleteOutline />;
    case 'edit':
      return <EditOutlined />;
    case 'home':
      return <Home />;
    case 'refresh':
      return <RefreshOutlined />;
    case 'new':
    case 'add':
      return <AddOutlined />;
    case 'filter':
      return <FilterAltOutlinedIcon />;
    case 'menu':
      return <MenuOutlinedIcon />;
    default:
      return <WarningOutlinedIcon />;
  }
}

export function RenderAction({
  actionDef,
  cx = {},
  data = {},
  action,
  dirty = false,
  variant
}: Readonly<{
  actionDef: ActionDef;
  cx: SRecord;
  data?: SRecord;
  action: NotifyFun;
  dirty?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
}>) {
  const [confirmationOn, setConfirmationOn] = useState(false);
  const { l } = useLabels();

  const visible = resolveBoolean2(actionDef.visible ?? true, cx);

  if (!visible) {
    return <></>;
  }

  let disabled = false;
  if (actionDef.enabled === 'onDirty' && !dirty) {
    disabled = true;
  }
  if (cx && typeof actionDef.enabled === 'function') {
    disabled = !actionDef.enabled({ cx, data });
  }

  const confirmation = texting(l(actionDef.confirmation) ?? '', cx);

  return (
    <div>
      <Dialog
        fullScreen={false}
        open={confirmationOn}
        onClose={() => setConfirmationOn(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Html content={confirmation}></Html>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOn(false)}>{ttLabel('No')}</Button>
          <Button
            onClick={() => {
              action();
              setConfirmationOn(false);
            }}
          >
            {ttLabel('Yes')}
          </Button>
        </DialogActions>
      </Dialog>
      <Tooltip title={actionDef.description ?? actionDef.label ?? ''} placement="top">
        <span>
          {actionDef.icon ? (
            <IconButton onClick={_processAction}>
              <NamedIcon iconName={actionDef.icon} />
            </IconButton>
          ) : (
            <Button sx={{ whiteSpace: 'nowrap' }} disabled={disabled} variant={variant} onClick={_processAction}>
              {ttLabel(actionDef)}
            </Button>
          )}
        </span>
      </Tooltip>
    </div>
  );

  function _processAction(e: MouseEvent) {
    e.stopPropagation();
    if (disabled) {
      return;
    }
    if (actionDef.confirmation) {
      setConfirmationOn(true);
    } else {
      action();
    }
  }
}

export function renderWidget({ def, value, cx, action }: WidgetProps) {
  const uiTypeFun = resolveUiType(def.uiType || 'InputUi');
  return typeof uiTypeFun === 'function' ? (
    <>{React.createElement(uiTypeFun, { def, value, action, cx }, null)} </>
  ) : (
    <InputUi def={def} value={value} action={action} cx={cx} />
  );
}
