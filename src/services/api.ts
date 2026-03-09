import createInstanceAxios from './axios';

const http = createInstanceAxios(import.meta.env.VITE_BACKEND_URL);

const axiosPayment = createInstanceAxios(
    import.meta.env.VITE_BACKEND_PAYMENT_URL,
);

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

export const getBooksAPI = (query: string) => {
    const urlBackend = `/api/v1/book?${query}`;
    return http.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend, {
        headers: {
            delay: 1000,
        },
    });
};

export const getCategoryAPI = () => {
    const urlBackend = '/api/v1/database/category';
    return http.get<IBackendRes<string[]>>(urlBackend);
};

export const uploadFileAPI = (fileImg: any, folder: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return http<
        IBackendRes<{
            fileUploaded: string;
        }>
    >({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            'Content-Type': 'multipart/form-data',
            'upload-type': folder,
        },
    });
};

export const createBookAPI = (
    mainText: string,
    author: string,
    price: number,
    quantity: number,
    category: string,
    thumbnail: string,
    slider: string[],
) => {
    const urlBackend = '/api/v1/book';
    return http.post<IBackendRes<IRegister>>(urlBackend, {
        mainText,
        author,
        price,
        quantity,
        category,
        thumbnail,
        slider,
    });
};

export const updateBookAPI = (
    _id: string,
    mainText: string,
    author: string,
    price: number,
    quantity: number,
    category: string,
    thumbnail: string,
    slider: string[],
) => {
    const urlBackend = `/api/v1/book/${_id}`;
    return http.put<IBackendRes<IRegister>>(urlBackend, {
        mainText,
        author,
        price,
        quantity,
        category,
        thumbnail,
        slider,
    });
};

export const deleteBookAPI = (_id: string) => {
    const urlBackend = `/api/v1/book/${_id}`;
    return http.delete<IBackendRes<IRegister>>(urlBackend);
};

export const getBookByIdAPI = (id: string) => {
    const urlBackend = `/api/v1/book/${id}`;
    return http.get<IBackendRes<IBookTable>>(urlBackend, {
        headers: {
            delay: 1000,
        },
    });
};

export const createOrderAPI = (
    name: string,
    address: string,
    phone: string,
    totalPrice: number,
    type: string,
    detail: any,
    paymentRef?: string,
) => {
    const urlBackend = '/api/v1/order';
    return http.post<IBackendRes<IRegister>>(urlBackend, {
        name,
        address,
        phone,
        totalPrice,
        type,
        detail,
        paymentRef,
    });
};

export const getHistoryAPI = () => {
    const urlBackend = `/api/v1/history`;
    return http.get<IBackendRes<IHistory[]>>(urlBackend);
};

export const updateUserInfoAPI = (
    _id: string,
    avatar: string,
    fullName: string,
    phone: string,
) => {
    const urlBackend = '/api/v1/user';
    return http.put<IBackendRes<IRegister>>(urlBackend, {
        fullName,
        phone,
        avatar,
        _id,
    });
};

export const updateUserPasswordAPI = (
    email: string,
    oldpass: string,
    newpass: string,
) => {
    const urlBackend = '/api/v1/user/change-password';
    return http.post<IBackendRes<IRegister>>(urlBackend, {
        email,
        oldpass,
        newpass,
    });
};

export const getOrdersAPI = (query: string) => {
    const urlBackend = `/api/v1/order?${query}`;
    return http.get<IBackendRes<IModelPaginate<IOrderTable>>>(urlBackend);
};

export const getVNPayUrlAPI = (
    amount: number,
    locale: string,
    paymentRef: string,
) => {
    const urlBackend = '/vnpay/payment-url';
    return axiosPayment.post<IBackendRes<{ url: string }>>(urlBackend, {
        amount,
        locale,
        paymentRef,
    });
};

export const updatePaymentOrderAPI = (
    paymentStatus: string,
    paymentRef: string,
) => {
    const urlBackend = '/api/v1/order/update-payment-status';
    return http.post<IBackendRes<ILogin>>(
        urlBackend,
        { paymentStatus, paymentRef },
        {
            headers: {
                delay: 1000,
            },
        },
    );
};

export const getDashboardAPI = () => {
    const urlBackend = `/api/v1/database/dashboard`;
    return http.get<
        IBackendRes<{
            countOrder: number;
            countUser: number;
            countBook: number;
        }>
    >(urlBackend);
};

export const loginWithGoogleAPI = (type: string, email: string) => {
    const urlBackend = '/api/v1/auth/social-media';
    return http.post<IBackendRes<ILogin>>(urlBackend, { type, email });
};
