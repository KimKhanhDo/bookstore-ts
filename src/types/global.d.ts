// declare global
export {};

declare global {
    // IBackendRes<T> tái sử dụng được cho mọi API, chỉ cần đổi T — đó chính là sức mạnh của Generic.
    // → Là cái HỘP NGOÀI — chứa statusCode, message, và data
    // → data có type T — tức là bên trong chứa gì tùy mình truyền vào
    // "Cái hộp ngoài (IBackendRes) chứa bên trong là ILogin"
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T; //  → T = ILogin
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        results: T[];
    }

    //  backend luôn trả về cùng một cấu trúc, chỉ có data là thay đổi tùy từng API:
    // → ILogin là NỘI DUNG bên trong data
    interface ILogin {
        access_token: string;
        user: {
            email: string;
            phone: string;
            fullName: string;
            role: string;
            avatar: string;
            id: string;
        };
    }

    interface IRegister {
        _id: string;
        email: string;
        fullName: string;
    }

    interface IUser {
        email: string;
        phone: string;
        fullName: string;
        role: string;
        avatar: string;
        id: string;
    }

    interface IFetchAccount {
        user: IUser;
    }
}
