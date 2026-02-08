'use client';

import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';
import styles from './Button.module.css';

interface CustomButtonProps extends Omit<AntButtonProps, 'variant'> {
    customVariant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    fullWidth?: boolean;
}

export default function Button({
    customVariant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}: CustomButtonProps) {
    const variantClass = styles[customVariant] || '';
    const widthClass = fullWidth ? styles.fullWidth : '';

    return (
        <AntButton
            className={`${styles.button} ${variantClass} ${widthClass} ${className}`}
            {...props}
        />
    );
}
