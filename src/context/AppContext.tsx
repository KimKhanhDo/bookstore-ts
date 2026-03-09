import { createContext, useContext, useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';

import { fetchAccountAPI } from '@/services/api';

interface IAppContext {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;

    user: IUser | null;
    setUser: (value: IUser | null) => void;

    isLoading: boolean;
    setIsLoading: (value: boolean) => void;

    carts: ICart[];
    setCarts: (v: ICart[]) => void;
}

type TProps = {
    children: React.ReactNode;
};

// createContext<IAppContext | null>(null) = "Tạo một context, bình thường chứa IAppContext, lúc chưa có data thì là null" — Generic chỉ đơn giản là để TypeScript biết context sẽ chứa gì.
const CurrentAppContext = createContext<IAppContext | null>(null);

export const AppProvider = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [carts, setCarts] = useState<ICart[]>([]);

    useEffect(() => {
        const fetchAccount = async () => {
            const res = await fetchAccountAPI();
            const carts = localStorage.getItem('carts');
            if (res?.data) {
                setUser(res.data.user);
                setIsAuthenticated(true);

                if (carts) {
                    setCarts(JSON.parse(carts));
                }
            }

            setIsLoading(false);
        };

        fetchAccount();
    }, []);

    return (
        <>
            {isLoading ? (
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <PacmanLoader
                        size={30}
                        color="#36d6b4"
                    />
                </div>
            ) : (
                <CurrentAppContext.Provider
                    value={{
                        isAuthenticated,
                        user,
                        setIsAuthenticated,
                        setUser,
                        isLoading,
                        setIsLoading,
                        carts,
                        setCarts,
                    }}
                >
                    {props.children}
                </CurrentAppContext.Provider>
            )}
        </>
    );
};

export const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentAppContext);

    if (!currentAppContext) {
        throw new Error(
            'useCurrentApp has to be use within <CurrentAppContext.Provider>',
        );
    }

    return currentAppContext;
};
