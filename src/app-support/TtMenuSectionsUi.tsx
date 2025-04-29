import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Stack } from '@mui/material';
import TtMenuEntryUi from './TtMenuEntryUi';
import TtMenuTitle from './TtMenuTitle';
import { dispatchDataMap, Navigator, useLabels, useUserInfo } from '../ui-factory';
import { AppException } from './TtMenuAppContentUi';
import { getTtReport } from '../reporting-support/report-utils';
import ReportUi from '../reporting-support/ReportUi';
import { TtMenuSection, TtMenuTab } from './types';
import { checkRoles } from './utils-roles';

type TtMenuProps = {
  menuTab: TtMenuTab;
};
const emptyRoles: string[] = [];

export function TtMenuSectionsUi({ menuTab }: TtMenuProps) {
  const { l } = useLabels();
  const userInfo = useUserInfo();
  const userRoles = userInfo.roles || emptyRoles;
  const [startForward, setStartForward] = useState('');

  const { ttDef, menuSections } = menuTab;

  useEffect(() => {
    if (!ttDef) {
      setStartForward('');
    }
  }, [ttDef]);

  useEffect(() => {
    if (ttDef) {
      setStartForward(ttDef.name);
      dispatchDataMap<string>('last-menu-name', ttDef.name);
    }
  }, [ttDef]);

  if (startForward) {
    // NAVIGATOR
    const reportDef = getTtReport(startForward);
    if (reportDef) {
      return <ReportUi def={reportDef} done={() => setStartForward('')} />;
    }
    return (
      <Container key={'with-forward'} maxWidth={false}>
        <Navigator initialForward={startForward} done={() => setStartForward('')} />
        <AppException />
      </Container>
    );
  } else {
    // SHOW MENU
    const t: TtMenuSection[] = menuSections || [];
    const filteredMenuSections = t.filter((mi) => checkRoles(mi.roles, userRoles));

    const nrOfCols = filteredMenuSections.reduce((a, item) => Math.max(a, item.colIndex), 0) + 1;
    const colIndexArray = new Array(nrOfCols).fill(0).map((_, i) => i);
    const xsItem = Math.floor(12 / nrOfCols);

    return (
      <Stack direction={'column'} spacing={1}>
        <TtMenuTitle content={<span>{l(menuTab)}</span>} />
        {filteredMenuSections ? (
          <Grid container spacing={2}>
            {colIndexArray.map((colIndex) => (
              <Grid key={colIndex} item xs={xsItem}>
                {filteredMenuSections.map((menuSection) => {
                  return menuSection.colIndex === colIndex ? (
                    <Box key={menuSection.name} sx={{ mb: '2em' }}>
                      <Box
                        sx={{
                          color: 'text.primary',
                          fontSize: '110%',
                          fontWeight: 'bold',
                          mb: '1em'
                        }}
                      >
                        {l(menuSection)}
                      </Box>
                      {(menuSection.menuEntries || []).map((menuEntry) => (
                        <TtMenuEntryUi
                          key={menuEntry.name}
                          menuEntry={menuEntry}
                          userInfo={userInfo}
                          setStartForward={setStartForward}
                        />
                      ))}
                    </Box>
                  ) : (
                    ''
                  );
                })}
              </Grid>
            ))}
          </Grid>
        ) : (
          ''
        )}
      </Stack>
    );
  }
}
