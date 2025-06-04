import { useState } from 'react';
import { Routes } from '../routes/routesPaths';
import { AuthLayout } from '../components/Auth/AuthLayout/AuthLayout';
import { BackLink } from '../components/Auth/BackLink/BackLink';
import { AuthForm } from '../components/Auth/AuthForm/AuthForm';
import { SwitchLink } from '../components/Auth/SwitchLink/SwitchLink';
import { useRegisterMutation } from '../api/authApi';
import { useAppDispatch } from '../stores/hooks';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../stores/reducers/authSlice';
import { parseAuthError } from '../utils/parseAuthError';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>();

  const handleSubmit = (values: Record<string, string>): void => {
    const email = values.email ?? '';
    const password = values.password ?? '';

    (async () => {
      try {
        const auth = await register({ email, password }).unwrap();
        dispatch(
          setCredentials({
            accessToken: auth.accessToken,
            refreshToken: auth.refreshToken,
            user: auth.user,
          }),
        );
        navigate(Routes.Auth.Portfolio);
      } catch (error) {
        const { fieldErrors, errorMessage } = parseAuthError(error);
        setFieldErrors(fieldErrors);
        if (errorMessage) {
          toast.error(errorMessage);
        }
      }
    })();
  };

  return (
    <AuthLayout>
      <BackLink to={Routes.Public.Main} />
      <h1 className='page-auth__title'>Регистрация</h1>
      <AuthForm
        fields={[
          {
            name: 'email',
            label: 'Email',
            type: 'email',
            placeholder: ' ',
          },
          {
            name: 'password',
            label: 'Пароль',
            type: 'password',
            placeholder: ' ',
          },
          {
            name: 'confirm',
            label: 'Подтвердите пароль',
            type: 'password',
            placeholder: ' '
          },
        ]}
        buttonText='Зарегистрироваться'
        buttonClass='btn-primary'
        isLoading={isLoading}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
      />
      <SwitchLink
        text='Уже есть аккаунт?'
        to={Routes.Public.Login}
        linkText='Войти'
      />
    </AuthLayout>
  )
};
