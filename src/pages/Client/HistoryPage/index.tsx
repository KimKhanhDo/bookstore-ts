import { useEffect, useState } from 'react';
import { App, Divider, Drawer, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';

import { getHistoryAPI } from '@/services/api';
import { FORMATE_DATE_VN } from '@/helper/dateRangeValidate';

const HistoryPage = () => {
    const columns: TableProps<IHistory>['columns'] = [
        {
            title: 'No.',
            dataIndex: 'index',
            key: 'index',
            render: (item, record, index) => <>{index + 1}</>,
        },
        {
            title: 'Time',
            dataIndex: 'createdAt',
            render: (item, record, index) => {
                return dayjs(item).format(FORMATE_DATE_VN);
            },
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalPrice',
            render: (item, record, index) => {
                return new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(item);
            },
        },
        {
            title: 'Status',
            render: (item, record, index) => (
                <Tag
                    color={
                        record.paymentStatus === 'UNPAID' ? 'volcano' : 'green'
                    }
                >
                    {record.paymentStatus}
                </Tag>
            ),
        },
        {
            title: 'Payment Ref',
            dataIndex: 'paymentRef',
        },
        {
            title: 'Details',
            key: 'action',
            render: (_, record) => (
                <a
                    onClick={() => {
                        setOpenDetail(true);
                        setDataDetail(record);
                    }}
                    href="#"
                >
                    View details
                </a>
            ),
        },
    ];

    const [dataHistory, setDataHistory] = useState<IHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [openDetail, setOpenDetail] = useState<boolean>(false);
    const [dataDetail, setDataDetail] = useState<IHistory | null>(null);

    const { notification } = App.useApp();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await getHistoryAPI();
            if (res && res.data) {
                setDataHistory(res.data);
            } else {
                notification.error({
                    message: 'An error occurred',
                    description: res.message,
                });
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div style={{ margin: 50 }}>
            <h3>Purchase History</h3>
            <Divider />
            <Table
                bordered
                columns={columns}
                dataSource={dataHistory}
                rowKey={'_id'}
                loading={loading}
            />
            <Drawer
                title="Order Details"
                onClose={() => {
                    setOpenDetail(false);
                    setDataDetail(null);
                }}
                open={openDetail}
            >
                {dataDetail?.detail?.map((item, index) => {
                    return (
                        <ul key={index}>
                            <li>Book Name: {item.bookName}</li>
                            <li>Quantity: {item.quantity}</li>
                            <Divider />
                        </ul>
                    );
                })}
            </Drawer>
        </div>
    );
};

export default HistoryPage;
