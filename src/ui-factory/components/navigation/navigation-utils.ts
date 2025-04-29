import { NavigationContext, NavigationContextType } from './NavigationProvider';
import { useContext } from 'react';

export const useNavigationContext = (): NavigationContextType => useContext(NavigationContext);
