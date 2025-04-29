import * as React from 'react';
import { ReactNode, useCallback, useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import {
  ActionDef,
  CodeTableEntries,
  dispatchCodeTables,
  dispatchLang,
  dispatchLoading,
  dispatchUserInfo,
  processService,
  SelectUi,
  useLabels,
  useLang,
  UserInfo
} from '../ui-factory';

import sha256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';
import { setSessionId } from './api-helper';
import { multiServicePromise } from '../myapp/api-utils';
import { Result, SRecord, toList } from 'remotequery-ts-common';
import { AuthData } from './types';

const languages = ['en', 'de'];

export function AppLogin({ loginLogo }: Readonly<{ loginLogo?: ReactNode }>) {
  const { label } = useLabels();
  const [loginMessage, setLoginMessage] = useState('');
  const [userId, setUserId] = useState(
    // localStorage.getItem('userId') ??
    ''
  );
  const [runAsUserId, setRunAsUserId] = useState('');
  const [password, setPassword] = useState(
    //localStorage.getItem('tspw') ??
    ''
  );
  const lang = useLang();

  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');

  const [showMore, setShowMore] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  localStorage.setItem('tspw', '');
  localStorage.setItem('userId', '');

  //const emptyUserIdOrPassword = !userId || !password;

  const processLoginResult = useCallback(
    async (result: Result | false) => {
      const exceptionMsg = result ? (result.exception ?? '') : '';
      if (exceptionMsg || result === false || result.table?.length !== 1) {
        setLoginMessage(`Login failed: ${exceptionMsg}!`);
      } else {
        const { userId, roles, sessionId } = toList<AuthData>(result)[0];
        setSessionId(sessionId);
        const actions: ActionDef[] = [
          {
            name: 'CodeTable.selectAll',
            serviceId: 'CodeTable.selectAll',
            parameters: {
              lang
            }
          }
        ];
        const [codeTables0] = await multiServicePromise(actions);
        const codeTableEntries = toList<CodeTableEntries>(codeTables0);
        const userInfo: UserInfo = {
          userId,
          roles: (roles || '').split(','),
          sessionId
        };
        dispatchCodeTables(codeTableEntries);
        dispatchUserInfo(userInfo);
      }
    },
    [lang]
  );

  const userLogin = async () => {
    const result = await processService('UserLogin', {
      action: 'logIn',
      userId,
      pwhash: sha256(password).toString(Hex),
      runAsUserId
    });
    return processLoginResult(result);
  };

  const userLoginWithNewPassword = async () => {
    const result = await processService('UserLogin', {
      action: 'changePassword',
      userId: userId,
      pwhash: sha256(password).toString(Hex),
      newPwhash: sha256(newPassword).toString(Hex)
    });
    return processLoginResult(result);
  };

  return (
    <form onSubmit={userLogin}>
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
        {loginLogo}
        {showChangePassword ? (
          renderChangePassword()
        ) : (
          <>
            <TextField
              key={'email'}
              name={'email'}
              autoComplete="username"
              sx={{ width: '22em' }}
              value={userId}
              label={'User Id / email'}
              onChange={(e) => setUserId(e.target.value)}
              InputLabelProps={{
                shrink: true // Force the label to shrink and float
              }}
            />

            <TextField
              key={'password'}
              name={'password'}
              autoComplete="current-password"
              sx={{ width: '22em' }}
              value={password}
              label={'Password'}
              type={'password'}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{
                shrink: true // Force the label to shrink and float
              }}
            />

            <SelectUi
              sx={{ width: '22em' }}
              def={{
                name: 'lang-selection',
                uiTypeOptions: { selectList: languages.map((l) => ({ value: l, label: l })) }
              }}
              value={lang}
              action={(_, r: SRecord) => dispatchLang(r['lang-selection'].toString())}
            />

            <Stack key="show-more" direction="row" justifyContent="center" alignItems="center" spacing={2}>
              {showMore ? '' : <Button onClick={userLogin}>Login</Button>}
              <Button onClick={() => setShowMore((b) => !b)}>{showMore ? label('Less...') : label('More....')}</Button>
            </Stack>
            <More show={showMore}>{renderMoreMenu()}</More>
          </>
        )}

        <Box sx={{ padding: '1em', color: 'red' }}>{loginMessage}</Box>
      </Stack>
    </form>
  );

  function renderMoreMenu() {
    return (
      <Stack direction="column" justifyContent="center" alignItems="stretch" spacing={1}>
        <Button key={'change-password'} variant={'outlined'} onClick={() => setShowChangePassword(true)}>
          Change Password
        </Button>
        <Button
          key={'new-password'}
          variant={'outlined'}
          disabled={!userId}
          onClick={async () => {
            try {
              dispatchLoading('Processing Login...');
              setLoginMessage('');
              setPassword('');
              //localStorage.setItem('userId', userId);
              //localStorage.setItem('tspw', '');

              await processService('UserLogin', { userId, action: 'newPasswordByMail' });
              setLoginMessage(label('new-password-sent'));
            } catch (e) {
              console.error('newPassword', e);
            } finally {
              dispatchLoading('');
            }
          }}
        >
          Create new password
        </Button>
        <Button
          variant={'outlined'}
          onClick={() => {
            setUserId('');
            setPassword('');
            setRunAsUserId('');
            setPassword('');
            //localStorage.setItem('userId', '');
            //localStorage.setItem('tspw', '');
            setLoginMessage(label('all-cleared...'));
          }}
        >
          {label('clear-all')}
        </Button>
      </Stack>
    );
  }

  function renderChangePassword() {
    return (
      <>
        <TextField
          sx={{ width: '22em' }}
          value={userId}
          label={'User Id / email'}
          onChange={(e) => setUserId(e.target.value)}
          InputLabelProps={{
            shrink: true // Force the label to shrink and float
          }}
        ></TextField>

        <TextField
          sx={{ width: '22em' }}
          value={password}
          label={'Password (Old)'}
          type={'password'}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{
            shrink: true // Force the label to shrink and float
          }}
        ></TextField>

        <TextField
          sx={{ width: '22em' }}
          value={newPassword}
          label={'New password'}
          type={'password'}
          onChange={(e) => setNewPassword(e.target.value)}
          InputLabelProps={{
            shrink: true // Force the label to shrink and float
          }}
        ></TextField>
        <TextField
          error={!!(newPassword2 && newPassword2 !== newPassword)}
          sx={{ width: '22em' }}
          value={newPassword2}
          label={'New password (2)'}
          type={'password'}
          onChange={(e) => setNewPassword2(e.target.value)}
          helperText={'Password has to be the same!'}
          InputLabelProps={{
            shrink: true // Force the label to shrink and float
          }}
        ></TextField>

        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
          <Button key={'set-new-password'} variant={'outlined'} onClick={userLoginWithNewPassword}>
            Set new password
          </Button>
          <Button key={'cancel'} variant={'outlined'} onClick={() => setShowChangePassword(false)}>
            Cancel
          </Button>{' '}
        </Stack>
      </>
    );
  }
}

function More({ show, children }: Readonly<{ show: boolean; children: React.ReactElement | string }>) {
  if (show) {
    return <Box>{children}</Box>;
  }
  return <></>;
}
