import styles from './AuthForm.module.scss';
import { FormField } from '../FormField/FormField';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Routes } from '../../../routes/routesPaths';

interface FieldConfig {
  name: string;
  label: string;
  type: 'email' | 'password' | 'text';
  placeholder?: string;
}

interface AuthFormProps {
  fields: FieldConfig[];
  buttonText: string;
  buttonClass: string;
  isLoading?: boolean;
  fieldErrors?: Record<string, string>;
  showForgotLink?: boolean;
  onSubmit: (values: Record<string, string>) => void;
}

export const AuthForm = ({
  fields,
  buttonText,
  buttonClass,
  isLoading = false,
  fieldErrors,
  showForgotLink,
  onSubmit,
}: AuthFormProps) => {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((field) => [field.name, ''])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [externalErrors, setExternalErrors] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    if (fieldErrors) {
      setExternalErrors(fieldErrors);
    }
  }, [fieldErrors]);

  const combinedErrors = { ...externalErrors, ...errors };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: '' }));
    setExternalErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const val = values[field.name]?.trim() || '';

      if (!val) {
        newErrors[field.name] =
          field.type === 'email'
            ? 'Введите адрес эл. почты'
            : 'Поле обязательно для заполнения';
        return;
      }

      if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(val)) {
        newErrors[field.name] = 'Некорректный email';
      }

      if (field.name === 'password' && (val.length < 5 || val.length > 32)) {
        newErrors[field.name] = 'Пароль должен быть 5-32 символов';
      }
    });

    const hasConfirm = fields.some((field) => field.name === 'confirm');
    if (hasConfirm && values.password !== values.confirm) {
      newErrors.confirm = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasErrors = Object.values(combinedErrors).some((msg) => !!msg);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // блокируем отправку, если идёт загрузка, есть ошибки или не прошли валидацию
    if (isLoading || hasErrors || !validate()) return;

    onSubmit(values);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {fields.map((f) => (
        <FormField
          key={f.name}
          name={f.name}
          label={f.label}
          type={f.type}
          placeholder={f.placeholder}
          value={values[f.name]}
          onChange={handleChange}
          error={combinedErrors[f.name]}
        />
      ))}

      {showForgotLink && (
        <div className={styles.extra}>
          <Link
            to={Routes.Public.ForgotPassword}
            className={styles.forgotLink}
          >
            Забыли пароль?
          </Link>
        </div>
      )}

      <button
        type='submit'
        className={`${styles.btn} ${styles[buttonClass]}`}
        disabled={isLoading || hasErrors}
      >
        {isLoading ? 'Загрузка...' : buttonText}
      </button>
    </form>
  );
};
