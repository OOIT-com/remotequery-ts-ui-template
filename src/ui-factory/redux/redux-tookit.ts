import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitState, TtReduxState, UserInfo } from '../types';

const initialState: TtReduxState = {
  userInfo: { userId: '', roles: [] },
  initState: {},
  menu: '',
  exception: '',
  dataMap: {},
  uiMap: {}
};

export const ttSlice = createSlice({
  name: 'tt',
  initialState,
  reducers: {
    loading: (state: TtReduxState, action: PayloadAction<string | undefined>) => {
      state.loadingMessage = action.payload ?? '';
    },
    setUserInfo: (state: TtReduxState, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    setInitState: (state: TtReduxState, action: PayloadAction<Partial<InitState>>) => {
      state.initState = action.payload;
    },
    setException: (state: TtReduxState, action: PayloadAction<string>) => {
      state.exception = action.payload;
    },
    setDataMap: (state: TtReduxState, action: PayloadAction<{ key: string; value: any }>) => {
      state.dataMap[action.payload.key] = action.payload.value;
    },
    setUiMap: (state: TtReduxState, action: PayloadAction<{ key: string; value: any }>) => {
      state.uiMap[action.payload.key] = action.payload.value;
    }
  }
});

export const { loading, setUserInfo, setInitState, setException, setDataMap, setUiMap } = ttSlice.actions;

export const store = configureStore({
  reducer: {
    tt: ttSlice.reducer
  }
});

export function getStore() {
  return store;
}

export type RootState = ReturnType<typeof store.getState>;

export const getUserInfo = (): UserInfo => store.getState().tt.userInfo;
export const selectUser = (state: RootState) => state.tt.userInfo;
