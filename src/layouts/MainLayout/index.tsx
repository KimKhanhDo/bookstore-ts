import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Header from './components/Header';

const MainLayout = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div>
            <Header
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
            <Outlet context={[searchTerm, setSearchTerm]} />
        </div>
    );
};

export default MainLayout;
