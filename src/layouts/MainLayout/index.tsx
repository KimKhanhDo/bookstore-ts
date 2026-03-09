import { Outlet } from 'react-router-dom';

import Header from './components/Header';
import { useState } from 'react';

const MainLayout = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div>
            <Header />
            <Outlet context={[searchTerm, setSearchTerm]} />
        </div>
    );
};

export default MainLayout;
