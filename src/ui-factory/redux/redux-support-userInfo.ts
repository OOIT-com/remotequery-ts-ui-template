import { UserInfo } from '../types';
import { selectUser, setUserInfo, store } from './redux-tookit';
import { useSelector } from 'react-redux';

export const useUserInfo = (): UserInfo => useSelector(selectUser);
export const dispatchUserInfo = (userInfo: UserInfo) => store.dispatch(setUserInfo(userInfo));
