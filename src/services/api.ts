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

export const getUsersAPI = (query: string) => {
    const url = `/api/v1/user?${query}`;
    return http.get<IBackendRes<IModelPaginate<IUserTable>>>(url);
};

export const createUsersAPI = (
    fullName: string,
    email: string,
    password: string,
    phone: string,
) => {
    const url = '/api/v1/user';
    return http.post<IBackendRes<IRegister>>(url, {
        fullName,
        email,
        password,
        phone,
    });
};

export const bulkCreateUserAPI = (
    data: {
        fullName: string;
        password: string;
        email: string;
        phone: string;
    }[],
) => {
    const url = '/api/v1/user/bulk-create';
    return http.post<IBackendRes<IResponseImport>>(url, data);
};

export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
    const url = '/api/v1/user';
    return http.put<IBackendRes<IResponseImport>>(url, {
        _id,
        fullName,
        phone,
    });
};

export const deleteUserAPI = (_id: string) => {
    const url = `/api/v1/user/${_id}`;
    return http.delete<IBackendRes<IResponseImport>>(url);
};
