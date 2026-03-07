import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from 'antd';

import '@/styles/global.scss';
import AppRouter from '@/router/AppRouter';
import { AppProvider } from '@/context/AppContext';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App>
            <AppProvider>
                <AppRouter />
            </AppProvider>
        </App>
    </StrictMode>,
);
