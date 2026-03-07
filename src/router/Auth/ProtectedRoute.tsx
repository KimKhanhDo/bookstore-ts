import { Link, Outlet, useLocation } from 'react-router-dom';

import './ProtectedRoute.scss';
import { useCurrentApp } from '@/context/AppContext';
import { Button, Result } from 'antd';

// interface IProps {
//     children: React.ReactNode;
// }

const ProtectedRoute = () => {
    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <div className="protected-route-container">
                <Result
                    status="403" // ← antd không có status="401", dùng "warning" thay thế
                    title="401"
                    subTitle="Please login to use this feature."
                    extra={
                        <Button type="primary">
                            <Link to="/login">Login</Link>
                        </Button>
                    }
                />
            </div>
        );
    }

    const isAtAdminPage = location.pathname.includes('admin');
    if (isAuthenticated && isAtAdminPage) {
        const role = user?.role;
        if (role === 'USER') {
            return (
                <div className="protected-route-container">
                    <Result
                        status="403"
                        title="403"
                        subTitle="Sorry, you are not authorized to access this page."
                        extra={
                            <Button type="primary">
                                <Link to="/"> Back Home</Link>
                            </Button>
                        }
                    />
                </div>
            );
        }

        return <Outlet />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
