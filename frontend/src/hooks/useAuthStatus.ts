import { useAppSelector } from '../stores/hooks';
import { selectInitialized, selectIsLoggedIn } from '../stores/reducers/authSlice';

export const useAuthStatus = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const initialized = useAppSelector(selectInitialized);

  return { isLoggedIn, initialized }
};
