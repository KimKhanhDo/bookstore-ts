import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App, ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';

import '@/styles/global.scss';
import AppRouter from '@/router/AppRouter';
import { AppProvider } from '@/context/AppContext';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App>
            <AppProvider>
                <ConfigProvider locale={enUS}>
                    <AppRouter />
                </ConfigProvider>
            </AppProvider>
        </App>
    </StrictMode>,
);
