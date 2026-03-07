import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { FaReact } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, Avatar, Popover } from 'antd';
import { Dropdown, Space } from 'antd';

import './Header.scss';
import { useCurrentApp } from '@/context/AppContext';
import { logOutAPI } from '@/services/api';

const Header = (props: any) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const { isAuthenticated, user, setUser, setIsAuthenticated } =
        useCurrentApp();

    const navigate = useNavigate();

    const handleLogout = async () => {
        //todo
        const res = await logOutAPI();
        if (res.data) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('access_token');
        }
    };

    let items = [
        {
            label: (
                <label
                    style={{ cursor: 'pointer' }}
                    onClick={() => alert('me')}
                >
                    Manage Account
                </label>
            ),
            key: 'account',
        },
        {
            label: <Link to="/history">Order History</Link>,
            key: 'history',
        },
        {
            label: (
                <label
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleLogout()}
                >
                    Logout
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
                {/* <div className='pop-cart-content'>
                    {carts?.map((book, index) => {
                        return (
                            <div className='book' key={`book-${index}`}>
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
                                <div>{book?.detail?.mainText}</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.detail?.price ?? 0)}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {carts.length > 0 ?
                    <div className='pop-cart-footer'>
                        <button onClick={() => navigate('/order')}>View Cart</button>
                    </div>
                    :
                    <Empty
                        description="No items in cart"
                    />
                } */}
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
                                    {' '}
                                    <FaReact className="rotate icon-react" />
                                    Bookstore
                                </span>

                                <VscSearchFuzzy className="icon-search" />
                            </span>
                            <input
                                className="input-search"
                                type={'text'}
                                placeholder="What are you looking for?"
                                // value={props.searchTerm}
                                // onChange={(e) => props.setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <nav className="page-header__bottom">
                        <ul
                            id="navigation"
                            className="navigation"
                        >
                            <li className="navigation__item">
                                <Popover
                                    className="popover-carts"
                                    placement="topRight"
                                    rootClassName="popover-carts"
                                    title={'Recently Added Items'}
                                    content={contentPopover}
                                    arrow={true}
                                >
                                    <Badge
                                        // count={carts?.length ?? 0}
                                        count={10}
                                        size={'small'}
                                        showZero
                                    >
                                        <FiShoppingCart className="icon-cart" />
                                    </Badge>
                                </Popover>
                            </li>
                            <li className="navigation__item mobile">
                                <Divider type="vertical" />
                            </li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ? (
                                    <span onClick={() => navigate('/login')}>
                                        {' '}
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
                title="Menu"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p>Account Settings</p>
                <Divider />

                <p onClick={handleLogout}>Logout</p>
                <Divider />
            </Drawer>
        </>
    );
};

export default Header;
