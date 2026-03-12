import {
    CloudUploadOutlined,
    DeleteTwoTone,
    EditTwoTone,
    ExportOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import { CSVLink } from 'react-csv';

import { deleteUserAPI, getUsersAPI } from '@/services/api';
import { dateRangeValidate } from '@/helper/dateRangeValidate';
import DetailUser from './DetailUser';
import CreateUser from './CreateUser';
import ImportUser from './ImportUser';
import UpdateUser from './UpdateUser';

type TSearch = {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
};

const CSVLinkAny = CSVLink as any;

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(
        null,
    );

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalImport, setOpenModalImport] = useState<boolean>(false);

    const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);

    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const handleDeleteUser = async (_id: string) => {
        setIsDeleteUser(true);
        const res = await deleteUserAPI(_id);
        if (res && res.data) {
            message.success('Delete user successfully');
            refreshTable();
        } else {
            notification.error({
                message: 'Error happened',
                description: res.message,
            });
        }
        setIsDeleteUser(false);
    };

    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
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
            title: 'Fullname',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true,
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#50c654"
                            style={{ cursor: 'pointer', margin: 15 }}
                            onClick={() => {
                                setDataUpdate(entity);
                                setOpenModalUpdate(true);
                            }}
                        />

                        <Popconfirm
                            placement="leftTop"
                            title={'Delete Confirmation'}
                            description={
                                'Are you sure you want to delete this user?'
                            }
                            onConfirm={() => handleDeleteUser(entity._id)}
                            okText="Confirm"
                            cancelText="Cancel"
                            okButtonProps={{ loading: isDeleteUser }}
                        >
                            <span style={{ cursor: 'pointer', marginLeft: 20 }}>
                                <DeleteTwoTone
                                    twoToneColor="#ff4d4f"
                                    style={{ cursor: 'pointer' }}
                                />
                            </span>
                        </Popconfirm>
                    </>
                );
            },
        },
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    };

    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);

                    let query = '';
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;

                        if (params.email) {
                            query += `&email=/${params.email}/i`;
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`;
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
                    } else {
                        // default
                        query += `&sort=-createdAt`;
                    }

                    const res = await getUsersAPI(query);
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
                                {range[0]}-{range[1]} of {total} items
                            </div>
                        );
                    },
                }}
                headerTitle="Table user"
                toolBarRender={() => [
                    <CSVLinkAny
                        data={currentDataTable}
                        filename="export-user.csv"
                    >
                        <Button
                            icon={<ExportOutlined />}
                            type="primary"
                        >
                            Export
                        </Button>
                    </CSVLinkAny>,

                    <Button
                        icon={<CloudUploadOutlined />}
                        type="primary"
                        onClick={() => setOpenModalImport(true)}
                    >
                        Import
                    </Button>,

                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModalCreate(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>,
                ]}
            />

            <DetailUser
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <CreateUser
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <ImportUser
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
                refreshTable={refreshTable}
            />

            <UpdateUser
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
        </>
    );
};

export default TableUser;
