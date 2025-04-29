import { useTheme } from '@mui/material/styles';
import * as React from 'react';
import { FC, ReactNode, useEffect, useState } from 'react';
import { AppBar, Box, Container, Divider, Stack, Toolbar, Typography } from '@mui/material';
import { AppToolbarButton } from './AppToolbarButton';
import IconButton from '@mui/material/IconButton';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { AppLogin, TtMenuAppContentUi } from '.';
import {
  dispatchLabels,
  dispatchPaletteModeToggle,
  errorMessage,
  infoMessage,
  Label,
  processService,
  StatusMessageElement,
  useLabels,
  useLang,
  useUserInfo
} from '../ui-factory';
import moment from 'moment';
import 'moment/locale/de';
import { MenuAppListFun, TtMenuApp } from './types';
import { toList } from 'remotequery-ts-common';

export const TtMenuAppUi: FC<{
  menuAppsFun: MenuAppListFun;
  appNameStart: string;
  logo: ReactNode;
  loginLogo?: ReactNode;
}> = ({ menuAppsFun, appNameStart, logo, loginLogo }) => {
  const theme = useTheme();
  const lang = useLang();
  const { l } = useLabels();
  const userInfo = useUserInfo();

  const [appName, setAppName] = useState(appNameStart);
  const [menuApps, setMenuApps] = useState<TtMenuApp[]>([]);
  useEffect(() => {
    if (userInfo?.userId) {
      menuAppsFun(userInfo)
        .then((ttMenuApps) => setMenuApps(ttMenuApps))
        .catch(console.error);
    }
  }, [menuAppsFun, userInfo]);

  useEffect(() => {
    const getLabels = async () => {
      moment.locale(lang);
      console.log('lang:', lang);
      console.log('today:', moment().format('D MMMM YYYY'));
      const result = await processService('Label.selectAll', {
        lang: localStorage.getItem('selected-lang') ?? 'en'
      });
      const labels = toList<Label>(result);
      dispatchLabels(labels);
    };
    getLabels().catch(console.error);
  }, [lang]);

  if (!userInfo?.userId) {
    return (
      <Box sx={{ paddingTop: '2em' }}>
        <AppLogin loginLogo={loginLogo} />
      </Box>
    );
  }

  if (menuApps.length === 0) {
    return <StatusMessageElement statusMessage={infoMessage('Loading App Definitions...')} />;
  }

  const menuApp: TtMenuApp | undefined = menuApps.find((ma) => ma.name === appName);
  if (!menuApp) {
    return <StatusMessageElement statusMessage={errorMessage(`Unknown app ${appName}`)} />;
  }
  return (
    <Box
      sx={{
        color: theme.palette.mode === 'dark' ? '#b7b7b7' : undefined,
        display: 'block',
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        boxSizing: 'border-box',
        p: 0
      }}
    >
      <AppBar
        key={`app-bar-${appName}`}
        position="static"
        elevation={0}
        sx={{ background: 'black', color: theme.palette.mode === 'dark' ? 'lightGray' : undefined }}
      >
        <Toolbar variant="dense">
          {logo}
          <Stack
            ml={'2em'}
            direction={'row'}
            spacing={2}
            divider={<Divider sx={{ borderColor: 'white' }} orientation="vertical" flexItem />}
          >
            {menuApps.map((menuApp) => {
              let label: string | ReactNode;
              if (typeof menuApp.label === 'function') {
                label = <menuApp.label />;
              } else {
                label = l({ name: menuApp.name, label: menuApp.label });
              }

              return (
                <AppToolbarButton
                  key={menuApp.name}
                  name={menuApp.name}
                  selectedName={appName}
                  label={label}
                  icon={menuApp.icon}
                  setAppName={setAppName}
                />
              );
            })}
          </Stack>
          <Typography component="div" sx={{ flexGrow: 1, float: 'right' }}>
            <IconButton style={{ float: 'right' }} onClick={() => dispatchPaletteModeToggle()} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Typography>
        </Toolbar>
      </AppBar>
      <Container key={`app-menu-${appName}`} maxWidth={false}>
        <Box sx={{ padding: '1em 0' }}>
          <TtMenuAppContentUi ttMenuApp={menuApp} />
        </Box>
      </Container>
    </Box>
  );
};
