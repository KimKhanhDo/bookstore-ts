import { useState } from 'react';
import { FaReact } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, Avatar, Popover, Empty } from 'antd';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import './Header.scss';
import { isMobile } from 'react-device-detect';
import { useCurrentApp } from '@/context/AppContext';
import { logOutAPI } from '@/services/api';
import ManageAccount from '@/components/client/account/ManageAccount';

interface IProps {
    searchTerm: string;
    setSearchTerm: (v: string) => void;
}

const AppHeader = (props: IProps) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);

    const {
        isAuthenticated,
        user,
        setUser,
        setIsAuthenticated,
        carts,
        setCarts,
    } = useCurrentApp();

    const navigate = useNavigate();

    const handleLogout = async () => {
        const res = await logOutAPI();
        if (res.data) {
            setUser(null);
            setCarts([]);
            setIsAuthenticated(false);
            localStorage.removeItem('access_token');
            localStorage.removeItem('carts');
        }
    };

    let items = [
        {
            label: (
                <label
                    style={{ cursor: 'pointer' }}
                    onClick={() => setOpenManageAccount(true)}
                >
                    Manage Account
                </label>
            ),
            key: 'account',
        },
        {
            label: <Link to="/history">Purchase History</Link>,
            key: 'history',
        },
        {
            label: (
                <label
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleLogout()}
                >
                    Log Out
                </label>
            ),
            key: 'logout',
        },
    ];

    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to="/admin">Admin Dashboard</Link>,
            key: 'admin',
        });
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    const contentPopover = () => {
        return (
            <div className="pop-cart-body">
                <div className="pop-cart-content">
                    {carts?.map((book, index) => {
                        return (
                            <div
                                className="book"
                                key={`book-${index}`}
                            >
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`}
                                />
                                <div>{book?.detail?.mainText}</div>
                                <div className="price">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(book?.detail?.price ?? 0)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {carts.length > 0 ? (
                    <div className="pop-cart-footer">
                        <button onClick={() => navigate('/order')}>
                            View Cart
                        </button>
                    </div>
                ) : (
                    <Empty description="No products in the cart" />
                )}
            </div>
        );
    };

    return (
        <>
            <div className="header-container">
                <header className="page-header">
                    <div className="page-header__top">
                        <div
                            className="page-header__toggle"
                            onClick={() => {
                                setOpenDrawer(true);
                            }}
                        >
                            ☰
                        </div>

                        <div className="page-header__logo">
                            <span className="logo">
                                <span onClick={() => navigate('/')}>
                                    <FaReact className="rotate icon-react" />
                                    Bookstore
                                </span>

                                <VscSearchFuzzy className="icon-search" />
                            </span>

                            <input
                                className="input-search"
                                type={'text'}
                                placeholder="What are you looking for today?"
                                value={props.searchTerm}
                                onChange={(e) =>
                                    props.setSearchTerm(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <nav className="page-header__bottom">
                        <ul
                            id="navigation"
                            className="navigation"
                        >
                            <li className="navigation__item">
                                {!isMobile ? (
                                    <Popover
                                        className="popover-carts"
                                        placement="topRight"
                                        rootClassName="popover-carts"
                                        title={'Recently Added Products'}
                                        content={contentPopover}
                                        arrow={true}
                                    >
                                        <Badge
                                            count={carts?.length ?? 0}
                                            size={'small'}
                                            showZero
                                        >
                                            <FiShoppingCart className="icon-cart" />
                                        </Badge>
                                    </Popover>
                                ) : (
                                    <Badge
                                        count={carts?.length ?? 0}
                                        size={'small'}
                                        showZero
                                        onClick={() => navigate('/order')}
                                    >
                                        <FiShoppingCart className="icon-cart" />
                                    </Badge>
                                )}
                            </li>

                            <li className="navigation__item mobile">
                                <Divider type="vertical" />
                            </li>

                            <li className="navigation__item mobile">
                                {!isAuthenticated ? (
                                    <span onClick={() => navigate('/login')}>
                                        Account
                                    </span>
                                ) : (
                                    <Dropdown
                                        menu={{ items }}
                                        trigger={['click']}
                                    >
                                        <Space>
                                            <Avatar src={urlAvatar} />
                                            {user?.fullName}
                                        </Space>
                                    </Dropdown>
                                )}
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>

            <Drawer
                title="Feature Menu"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p>Manage Account</p>
                <Divider />

                <p onClick={() => handleLogout()}>Log Out</p>
                <Divider />
            </Drawer>

            <ManageAccount
                isModalOpen={openManageAccount}
                setIsModalOpen={setOpenManageAccount}
            />
        </>
    );
};

export default AppHeader;
