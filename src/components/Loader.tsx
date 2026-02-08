'use client';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './Loader.module.css';

interface LoaderProps {
    size?: 'small' | 'default' | 'large';
    fullScreen?: boolean;
    text?: string;
}

export default function Loader({
    size = 'default',
    fullScreen = false,
    text
}: LoaderProps) {
    const sizeMap = {
        small: 24,
        default: 40,
        large: 56,
    };

    const loader = (
        <div className={styles.loaderContent}>
            <Spin
                indicator={
                    <LoadingOutlined
                        style={{ fontSize: sizeMap[size] }}
                        spin
                    />
                }
            />
            {text && <p className={styles.text}>{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className={styles.fullScreen}>
                {loader}
            </div>
        );
    }

    return loader;
}
