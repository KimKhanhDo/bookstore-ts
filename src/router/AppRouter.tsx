import {
    createBrowserRouter as Router,
    RouterProvider,
} from 'react-router-dom';

import ProtectedRoute from '@/router/Auth/ProtectedRoute';
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';
import AboutPage from '@/pages/Client/AboutPage';
import BookPage from '@/pages/Client/BookPage';
import HomePage from '@/pages/Client/HomePage';
import RegisterPage from '@/pages/Client/Auth/RegisterPage';
import LoginPage from '@/pages/Client/Auth/LoginPage';
import DashBoard from '@/pages/Admin/DashBoard';
import ManageBook from '@/pages/Admin/ManageBook';
import ManageOrder from '@/pages/Admin/ManageOrder';
import ManageUser from '@/pages/Admin/ManageUser';
import OrderPage from '@/pages/Client/OrderPage';
import HistoryPage from '@/pages/Client/HistoryPage';

const router = Router([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            // Public routes - không cần login
            { index: true, element: <HomePage /> },
            { path: '/book/:id', element: <BookPage /> },

            { path: '/about', element: <AboutPage /> },

            // Protected routes - cần login
            {
                element: <ProtectedRoute />,
                children: [
                    { path: '/order', element: <OrderPage /> },
                    { path: '/history', element: <HistoryPage /> },
                ],
            },
        ],
    },
    {
        path: 'admin',
        element: <ProtectedRoute />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { index: true, element: <DashBoard /> },
                    { path: 'book', element: <ManageBook /> },
                    { path: 'order', element: <ManageOrder /> },
                    { path: 'user', element: <ManageUser /> },
                ],
            },
        ],
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
]);

const AppRouter = () => {
    return <RouterProvider router={router} />;
};
export default AppRouter;
