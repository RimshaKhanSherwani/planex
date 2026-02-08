'use client';

import { ConfigProvider, theme } from 'antd';
import { useAtom } from 'jotai';
import { themeAtom } from '@/store/dashboardStore';
import { ReactNode, useEffect, useState } from 'react';

interface AntdProviderProps {
    children: ReactNode;
}

export default function AntdProvider({ children }: AntdProviderProps) {
    const [currentTheme] = useAtom(themeAtom);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            document.documentElement.className = currentTheme;
        }
    }, [currentTheme, mounted]);

    if (!mounted) {
        return null;
    }

    return (
        <ConfigProvider
            theme={{
                algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#6366f1',
                    colorSuccess: '#10b981',
                    colorWarning: '#f59e0b',
                    colorError: '#ef4444',
                    colorInfo: '#3b82f6',
                    borderRadius: 12,
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
                },
                components: {
                    Button: {
                        borderRadius: 10,
                        controlHeight: 40,
                    },
                    Card: {
                        borderRadiusLG: 16,
                    },
                    Modal: {
                        borderRadiusLG: 16,
                    },
                    Input: {
                        borderRadius: 10,
                        controlHeight: 42,
                    },
                    Select: {
                        borderRadius: 10,
                        controlHeight: 42,
                    },
                    Popover: {
                        borderRadiusLG: 12,
                    },
                    Popconfirm: {
                        borderRadiusLG: 12,
                    },
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
}
