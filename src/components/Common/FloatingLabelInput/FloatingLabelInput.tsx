import { useState, FC, CSSProperties } from 'react';
import styles from './FloatingLabelInput.module.scss';

interface FloatingLabelInputProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: string;
  placeholder?: string;
  style?: CSSProperties;
  disabled?: boolean;
}

export const FloatingLabelInput: FC<FloatingLabelInputProps> = ({ id, label, value, onChange, type = 'text', placeholder = ' ', style, disabled }) => {
  const [focused, setFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(newValue);
  };

  return (
    <div className={styles.inputContainer}>
      <input 
        id={id}
        type={type}
        placeholder={placeholder} 
        value={value}
        className={styles.skinInput}
        style={style}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleChange}
        disabled={disabled}
      />
      <label 
        htmlFor={id} 
        className={`${styles.label} ${focused || value ? styles.labelFocused : ''}`}
      >
        {label}
      </label>
    </div>
  );
};
