'use client';

import { Input as AntInput, InputProps as AntInputProps } from 'antd';
import styles from './Input.module.css';

interface InputProps extends AntInputProps {
    fullWidth?: boolean;
}

export default function Input({
    fullWidth = true,
    className = '',
    ...props
}: InputProps) {
    const widthClass = fullWidth ? styles.fullWidth : '';

    return (
        <AntInput
            className={`${styles.input} ${widthClass} ${className}`}
            {...props}
        />
    );
}
