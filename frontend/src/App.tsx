import { useEffect } from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { useAppDispatch } from './stores/hooks';
import { useRefreshQuery } from './api/authApi';
import { logout, setCredentials } from './stores/reducers/authSlice';
import { Loader } from './components/Loader/Loader';
import { Toaster } from 'react-hot-toast';

function App() {
  const dispatch = useAppDispatch();

  const { data, isLoading, isError, isUninitialized } = useRefreshQuery(
    undefined,
    {
      refetchOnMountOrArgChange: false, // false — чтобы не дергать повторно
    },
  );

  useEffect(() => {
    if (isUninitialized) return;

    if (data) {
      dispatch(
        setCredentials({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        }),
      );
    } else if (isError) {
      dispatch(logout());
    }
  }, [isUninitialized, data, isError, dispatch]);

  if (isUninitialized || isLoading) {
    return <Loader />;
  }

  return (
    <>
      <AppRoutes />
      <Toaster position='top-center' />
    </>
  );
}

export default App;
