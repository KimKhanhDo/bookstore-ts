import {
    createBrowserRouter as Router,
    RouterProvider,
} from 'react-router-dom';

import ProtectedRoute from '@/router/Auth/ProtectedRoute';
import MainLayout from '@/layouts/MainLayout';
import AboutPage from '@/pages/User/AboutPage';
import BookPage from '@/pages/User/BookPage';
import HomePage from '@/pages/User/HomePage';
import RegisterPage from '@/pages/User/Auth/RegisterPage';
import LoginPage from '@/pages/User/Auth/LoginPage';
import AdminLayout from '@/layouts/AdminLayout';
import DashBoard from '@/pages/Admin/DashBoard';
import ManageBook from '@/pages/Admin/ManageBook';
import ManageOrder from '@/pages/Admin/ManageOrder';
import ManageUser from '@/pages/Admin/ManageUser';
import CheckOutPage from '@/pages/User/CheckOutPage';

const router = Router([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            // Public routes - không cần login
            { index: true, element: <HomePage /> },
            { path: '/book', element: <BookPage /> },
            { path: '/about', element: <AboutPage /> },

            // Protected routes - cần login
            {
                element: <ProtectedRoute />,
                children: [{ path: '/checkout', element: <CheckOutPage /> }],
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
