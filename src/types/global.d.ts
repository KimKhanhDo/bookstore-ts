// declare global
export {};

declare global {
    /**
     * "Cái hộp ngoài" mà server luôn trả về.
     * Bên trong chứa gì tùy vào T bạn truyền vào.
     *
     * VD: IBackendRes<ILogin>  → data là thông tin login
     *     IBackendRes<IUser[]> → data là danh sách user
     *     IBackendRes<null>    → không cần data (delete, logout)
     */
    interface IBackendRes<T> {
        statusCode: number | string;
        error?: string | string[];
        message: string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: T[];
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

    interface IUserTable {
        _id: string;
        fullName: string;
        email: string;
        phone: string;
        role: string;
        avatar: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IResponseImport {
        countSuccess: number;
        countError: number;
        detail: any;
    }

    interface IBookTable {
        _id: string;
        thumbnail: string;
        slider: string[];
        mainText: string;
        author: string;
        price: number;
        sold: number;
        quantity: number;
        category: string;
        createdAt: Date;
        updatedAt: Date;
    }

    interface ICart {
        _id: string;
        quantity: number;
        detail: IBookTable;
    }

    interface IHistory {
        _id: string;
        name: string;
        type: string;
        email: string;
        phone: string;
        userId: string;
        detail: {
            bookName: string;
            quantity: number;
            _id: string;
        }[];
        totalPrice: number;
        createdAt: Date;
        updatedAt: Date;
        paymentStatus: string;
        paymentRef: string;
    }

    interface IOrderTable extends IHistory {}
}
