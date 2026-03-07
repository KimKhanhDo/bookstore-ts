import http from './axios';

export const loginAPI = (username: string, password: string) => {
    const url = '/api/v1/auth/login';
    return http.post<IBackendRes<ILogin>>(
        url,
        { username, password },
        {
            headers: {
                delay: 1000,
            },
        },
    );
};

export const registerAPI = (
    fullName: string,
    email: string,
    password: string,
    phone: string,
) => {
    const url = '/api/v1/user/register';
    return http.post<IBackendRes<IRegister>>(url, {
        fullName,
        email,
        password,
        phone,
    });
};

export const fetchAccountAPI = () => {
    const url = '/api/v1/auth/account';
    return http.get<IBackendRes<IFetchAccount>>(url, {
        headers: {
            delay: 1000,
        },
    });
};

export const logOutAPI = () => {
    const url = '/api/v1/auth/logout';
    return http.post<IBackendRes<IRegister>>(url);
};
