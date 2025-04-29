/* tslint:disable: */
import * as React from 'react';
import { useEffect, useState } from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Loader, setCallApi, store, usePaletteMode } from '../ui-factory';
import { blue, orange } from '@mui/material/colors';
import { callServiceQuery } from '../app-support/api-helper';
import { Provider } from 'react-redux';
import { menuAppListFun } from './menu-app-list-fun';
import { Box } from '@mui/material';

import './appinit';
import { TtMenuAppUi } from '../app-support';
import { getWelcome } from './get-img';
import LandscapeOutlinedIcon from '@mui/icons-material/LandscapeOutlined';
setCallApi(callServiceQuery);

export function MyRemoteQueryUiApp() {
  return (
    <Provider store={store}>
      <AppInner />
      <Loader />
    </Provider>
  );
}

function AppInner() {
  const mode = usePaletteMode();

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: blue,
          secondary: orange
        },

        components: {
          // Tooltip
          MuiTooltip: {
            defaultProps: {
              arrow: true
            }
          },

          MuiButtonBase: {
            styleOverrides: {
              root: {
                '& .MuiSvgIcon-root': {
                  color: 'inherit'
                }
              }
            }
          },

          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none'
              }
            }
          },

          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: 'none'
              }
            }
          }
        }
      }),
    [mode]
  );

  const [welcomePng, setWelcomePng] = useState('');

  useEffect(() => {
    getWelcome()
      .then((png) => setWelcomePng(png))
      .catch(console.error);
  });

  const logo = (
    <Box>
      <LandscapeOutlinedIcon sx={{ color: 'yellow', lineHeight: '1.2', fontSize: '2em' }} />
    </Box>
  );

  const loginLogo = (
    <Box sx={{ padding: '2em', margin: '2em', boxShadow: '2px 2px 10px lightgrey' }}>
      <img width={300} src={welcomePng} alt={'Welcome to Remote Query Ui!'} />
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <TtMenuAppUi menuAppsFun={menuAppListFun} appNameStart={'training'} logo={logo} loginLogo={loginLogo} />
    </ThemeProvider>
  );
}
