import React from 'react';
import styles from './FormField.module.scss';

interface FormFieldProps {
  name: string;
  label: string;
  type: 'email' | 'password' | 'text';
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const FormField = ({
  name,
  label,
  type,
  placeholder,
  required = false,
  value,
  onChange,
  error,
}: FormFieldProps) => {
  return (
    <label className={styles.field} htmlFor={name}>
      <input
        id={name}
        name={name}
        type={type}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
      />
      <span className={`${styles.label} ${error ? styles.error : ''}`}>
        {label}
      </span>
      {error && <div className={styles.error}>{error}</div>}
    </label>
  );
};
