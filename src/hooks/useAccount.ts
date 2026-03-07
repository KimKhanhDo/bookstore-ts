import { useEffect } from 'react';
import { fetchAccountAPI } from '@/services/api';
import { useCurrentApp } from '@/context/AppContext';

export const useAccount = () => {
    const {
        setUser,
        user,
        isLoading,
        isAuthenticated,
        setIsLoading,
        setIsAuthenticated,
    } = useCurrentApp();

    useEffect(() => {
        const fetchAccount = async () => {
            const res = await fetchAccountAPI();
            if (res?.data) {
                setUser(res.data.user);
                setIsAuthenticated(true);
            }

            setIsLoading(false);
        };

        fetchAccount();
    }, []);

    return { user, isLoading, isAuthenticated };
};
