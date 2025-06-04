import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../api/authApi';
import { useAppDispatch } from '../../stores/hooks';
import styles from './Header.module.scss';
import { logout } from '../../stores/reducers/authSlice';
import { Routes } from '../../routes/routesPaths';
import { baseApi } from '../../api/baseApi';

export const Header = () => {
  const [logoutApi] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutApi()
      .unwrap()
      .catch(() => {});

    dispatch(logout());

    dispatch(baseApi.util.resetApiState());

    navigate(Routes.Public.Login, { replace: true });
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>SteamFol</h1>

      <div className={styles.profile}>
        <button className={styles.btn}>Профиль</button>
        <button
          className={`${styles.btn} ${styles.btnLogout}`}
          onClick={handleLogout}
        >
          Выйти
        </button>
      </div>
    </header>
  );
};
