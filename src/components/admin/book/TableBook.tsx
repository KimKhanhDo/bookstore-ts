import { useRef, useState } from 'react';
import { Popconfirm, Button, App } from 'antd';
import {
    DeleteTwoTone,
    EditTwoTone,
    ExportOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import { ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

import CreateBook from './CreateBook';
import BookDetail from './BookDetail';
import UpdateBook from './UpdateBook';
import { dateRangeValidate } from '@/helper/dateRangeValidate';
import { deleteBookAPI, getBooksAPI } from '@/services/api';

type TSearch = {
    mainText: string;
    author: string;
    createdAt: string;
    createdAtRange: string;
    updatedAt: string;
    updatedAtRange: string;
    price: number;
};

const CSVLinkAny = CSVLink as any;

const TableBook = () => {
    const actionRef = useRef<ActionType>();

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(
        null,
    );

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([]);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);

    const [isDeleteBook, setIsDeleteBook] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const handleDeleteBook = async (_id: string) => {
        setIsDeleteBook(true);
        const res = await deleteBookAPI(_id);
        if (res && res.data) {
            message.success('Book deleted successfully');
            refreshTable();
        } else {
            notification.error({
                message: 'An error occurred',
                description: res.message,
            });
        }
        setIsDeleteBook(false);
    };

    const refreshTable = () => {
        actionRef.current?.reload();
    };

    const columns: ProColumns<IBookTable>[] = [
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity) {
                return (
                    <a
                        href="#"
                        onClick={() => {
                            setDataViewDetail(entity);
                            setOpenViewDetail(true);
                        }}
                    >
                        {entity._id}
                    </a>
                );
            },
        },
        {
            title: 'Book Title',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            hideInSearch: true,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            sorter: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            hideInSearch: true,
            sorter: true,
            render(dom, entity) {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(entity.price)}
                    </>
                );
            },
        },
        {
            title: 'Updated Date',
            dataIndex: 'updatedAt',
            sorter: true,
            valueType: 'date',
            hideInSearch: true,
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#50c654"
                            style={{ cursor: 'pointer', margin: '0 10px' }}
                            onClick={() => {
                                setOpenModalUpdate(true);
                                setDataUpdate(entity);
                            }}
                        />

                        <Popconfirm
                            placement="leftTop"
                            title={'Confirm delete book'}
                            description={
                                'Are you sure you want to delete this book?'
                            }
                            onConfirm={() => handleDeleteBook(entity._id)}
                            okText="Confirm"
                            cancelText="Cancel"
                            okButtonProps={{ loading: isDeleteBook }}
                        >
                            <span style={{ cursor: 'pointer' }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>
                    </>
                );
            },
        },
    ];

    return (
        <>
            <ProTable<IBookTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort) => {
                    let query = '';

                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;

                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`;
                        }

                        if (params.author) {
                            query += `&author=/${params.author}/i`;
                        }

                        const createDateRange = dateRangeValidate(
                            params.createdAtRange,
                        );

                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
                        }
                    }

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`;
                    } else query += `&sort=-createdAt`;

                    if (sort && sort.mainText) {
                        query += `&sort=${sort.mainText === 'ascend' ? 'mainText' : '-mainText'}`;
                    }

                    if (sort && sort.author) {
                        query += `&sort=${sort.author === 'ascend' ? 'author' : '-author'}`;
                    }

                    if (sort && sort.price) {
                        query += `&sort=${sort.price === 'ascend' ? 'price' : '-price'}`;
                    }

                    const res = await getBooksAPI(query);

                    if (res.data) {
                        setMeta(res.data.meta);
                        setCurrentDataTable(res.data?.result ?? []);
                    }

                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total,
                    };
                }}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => {
                        return (
                            <div>
                                {range[0]}-{range[1]} of {total} rows
                            </div>
                        );
                    },
                }}
                headerTitle="Book Table"
                toolBarRender={() => [
                    <CSVLinkAny
                        data={currentDataTable}
                        filename="export-book.csv"
                    >
                        <Button
                            icon={<ExportOutlined />}
                            type="primary"
                        >
                            Export
                        </Button>
                    </CSVLinkAny>,

                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModalCreate(true);
                        }}
                        type="primary"
                    >
                        Add New
                    </Button>,
                ]}
            />

            <BookDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <CreateBook
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <UpdateBook
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    );
};

export default TableBook;
