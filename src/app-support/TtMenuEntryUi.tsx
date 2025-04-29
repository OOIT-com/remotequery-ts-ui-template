import { TtMenuEntry } from './types';
import {
  dispatchDataMap,
  isTtDef,
  registerTtDefs,
  resolveTtDef,
  SetFun,
  TtDef,
  useDataMap,
  useLabels,
  UserInfo
} from '../ui-factory';
import { Box, Button } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { getTtReport } from '../reporting-support/report-utils';
import { withStyles } from 'tss-react/mui';

const MenuEntryButton = withStyles(Button, {
  text: {
    textTransform: 'none'
  }
});
type TtMenuEntryProps = {
  menuEntry: TtMenuEntry | TtDef;
  setStartForward: SetFun<string>;
  userInfo: UserInfo;
};
export default function TtMenuEntryUi({ menuEntry, setStartForward }: Readonly<TtMenuEntryProps>) {
  useMemo(() => {
    if (isTtDef(menuEntry)) {
      registerTtDefs(menuEntry);
    }
  }, [menuEntry]);

  const { l } = useLabels();

  const theme = useTheme();
  const lastMenuName = useDataMap<string>('last-menu-name');

  const name = menuEntry.name;
  const def = getTtReport(name) || resolveTtDef(name);
  if (!def) {
    return (
      <Box>
        <MenuEntryButton variant={'text'} disabled={true}>{`${name} (NA)`}</MenuEntryButton>
      </Box>
    );
  }

  return (
    <Box>
      <MenuEntryButton
        onClick={() => {
          setStartForward(name);
          dispatchDataMap<string>('last-menu-name', name);
        }}
        sx={{ color: theme.palette.mode === 'dark' ? 'lightGray' : undefined, cursor: 'pointer' }}
        variant={'text'}
      >
        {lastMenuName === name ? (
          <KeyboardArrowDown key={'icon-down'} fontSize={'small'} alignmentBaseline={'middle'} />
        ) : (
          <KeyboardArrowRight key={'icon-right'} fontSize={'small'} alignmentBaseline={'middle'} />
        )}
        {menuEntry.label ?? l(def)}
      </MenuEntryButton>
    </Box>
  );
}
