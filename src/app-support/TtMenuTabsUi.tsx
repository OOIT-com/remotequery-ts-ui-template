import { infoMessage, Navigator, StatusMessageElement, ttLabel, useLabels, useUserInfo } from '../ui-factory';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import { Tab, Tabs } from '@mui/material';
import { TtMenuSectionsUi } from './TtMenuSectionsUi';
import { TtMenuTab } from './types';
import { checkRoles } from './utils-roles';

const emptyArray: string[] = [];

export function TtMenuTabsUi({ menuTabs }: { menuTabs: TtMenuTab[] }) {
  const { label } = useLabels();
  const userInfo = useUserInfo();
  const userRoles = userInfo?.roles || emptyArray;
  const filteredMenuTabs = useMemo(
    () => menuTabs.filter((mi) => checkRoles(mi.roles, userRoles)),
    [menuTabs, userRoles]
  );

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setSelectedIndex(newValue);
  }, []);

  if (filteredMenuTabs.length === 0) {
    return <StatusMessageElement statusMessage={infoMessage(ttLabel('There_are_no_menu_items_available!'))} />;
  }
  const selectedMenuTab = filteredMenuTabs[selectedIndex];
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedIndex} onChange={handleChange}>
          {filteredMenuTabs.map((menuTab) => (
            <Tab key={menuTab.name} label={label(menuTab)} sx={{ textTransform: 'none' }} />
          ))}
        </Tabs>
      </Box>

      <Box key={'selected-menu-tab'} sx={{ marginTop: '1em' }}>
        {renderMenuTabSwitch(selectedMenuTab)}
      </Box>
    </Box>
  );

  function renderMenuTabSwitch(menuTab: TtMenuTab) {
    if (menuTab.Ui) {
      return <menuTab.Ui />;
    }
    if (menuTab.ttDef) {
      return <Navigator key={menuTab.ttDef.name} initialForward={menuTab.ttDef.name} done={() => {}} />;
    }
    if (menuTab.menuSections) {
      return <TtMenuSectionsUi key={menuTab.name} menuTab={menuTab} />;
    }
    return <Box key={menuTab.name}>{`Menu definition ${menuTab.label} (${menuTab.name}) is empty`}</Box>;
  }
}
