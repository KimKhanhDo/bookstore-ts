import { App, Button, Col, Divider, Form, Radio, Row, Space } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Input } from 'antd';
import type { FormProps } from 'antd';
import { isMobile } from 'react-device-detect';
import { v4 as uuidv4 } from 'uuid';

import { createOrderAPI, getVNPayUrlAPI } from '@/services/api';
import { useCurrentApp } from '@/context/AppContext';

const { TextArea } = Input;

type UserMethod = 'COD' | 'BANKING';

type FieldType = {
    fullName: string;
    phone: string;
    address: string;
    method: UserMethod;
};

interface IProps {
    setCurrentStep: (v: number) => void;
}

const Payment = (props: IProps) => {
    const { carts, setCarts, user } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState(0);

    const [form] = Form.useForm();

    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const { setCurrentStep } = props;

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName,
                phone: user.phone,
                method: 'COD',
            });
        }
    }, [user]);

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map((item) => {
                sum += item.quantity * item.detail.price;
            });
            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }
    }, [carts]);

    const handleRemoveBook = (_id: string) => {
        const cartStorage = localStorage.getItem('carts');
        if (cartStorage) {
            const carts = JSON.parse(cartStorage) as ICart[];
            const newCarts = carts.filter((item) => item._id !== _id);
            localStorage.setItem('carts', JSON.stringify(newCarts));
            setCarts(newCarts);
        }
    };

    const handlePlaceOrder: FormProps<FieldType>['onFinish'] = async (
        values,
    ) => {
        const { address, fullName, method, phone } = values;

        const detail = carts.map((item) => ({
            _id: item._id,
            quantity: item.quantity,
            bookName: item.detail.mainText,
        }));

        setIsSubmit(true);
        let res = null;
        const paymentRef = uuidv4();

        if (method === 'COD') {
            res = await createOrderAPI(
                fullName,
                address,
                phone,
                totalPrice,
                method,
                detail,
            );
        } else {
            res = await createOrderAPI(
                fullName,
                address,
                phone,
                totalPrice,
                method,
                detail,
                paymentRef,
            );
        }

        if (res?.data) {
            localStorage.removeItem('carts');
            setCarts([]);

            if (method === 'COD') {
                message.success('Order placed successfully!');
                setCurrentStep(2);
            } else {
                const r = await getVNPayUrlAPI(totalPrice, 'vn', paymentRef);
                if (r.data) {
                    window.location.href = r.data.url;
                } else {
                    notification.error({
                        message: 'An error occurred',
                        description:
                            r.message && Array.isArray(r.message)
                                ? r.message[0]
                                : r.message,
                        duration: 5,
                    });
                }
            }
        } else {
            notification.error({
                message: 'An error occurred',
                description:
                    res.message && Array.isArray(res.message)
                        ? res.message[0]
                        : res.message,
                duration: 5,
            });
        }

        setIsSubmit(false);
    };

    return (
        <div style={{ overflow: 'hidden' }}>
            <Row gutter={[20, 20]}>
                <Col
                    md={16}
                    xs={24}
                >
                    {carts?.map((item, index) => {
                        const currentBookPrice = item?.detail?.price ?? 0;
                        return (
                            <div
                                className="order-book"
                                key={`index-${index}`}
                                style={
                                    isMobile ? { flexDirection: 'column' } : {}
                                }
                            >
                                {!isMobile ? (
                                    <>
                                        <div className="book-content">
                                            <img
                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail?.thumbnail}`}
                                            />
                                            <div className="title">
                                                {item?.detail?.mainText}
                                            </div>
                                            <div className="price">
                                                {new Intl.NumberFormat(
                                                    'vi-VN',
                                                    {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    },
                                                ).format(currentBookPrice)}
                                            </div>
                                        </div>
                                        <div className="action">
                                            <div className="quantity">
                                                Quantity: {item?.quantity}
                                            </div>
                                            <div className="sum">
                                                Total:{' '}
                                                {new Intl.NumberFormat(
                                                    'vi-VN',
                                                    {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    },
                                                ).format(
                                                    currentBookPrice *
                                                        (item?.quantity ?? 0),
                                                )}
                                            </div>
                                            <DeleteTwoTone
                                                style={{ cursor: 'pointer' }}
                                                onClick={() =>
                                                    handleRemoveBook(item._id)
                                                }
                                                twoToneColor="#eb2f96"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>{item?.detail?.mainText}</div>
                                        <div
                                            className="book-content "
                                            style={{ width: '100%' }}
                                        >
                                            <img
                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail?.thumbnail}`}
                                            />
                                            <div className="action">
                                                <div className="quantity">
                                                    Quantity: {item?.quantity}
                                                </div>
                                                <DeleteTwoTone
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() =>
                                                        handleRemoveBook(
                                                            item._id,
                                                        )
                                                    }
                                                    twoToneColor="#eb2f96"
                                                />
                                            </div>
                                        </div>
                                        <div className="sum">
                                            Total:{' '}
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(
                                                currentBookPrice *
                                                    (item?.quantity ?? 0),
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}

                    <div>
                        <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => setCurrentStep(0)}
                        >
                            Go back
                        </span>
                    </div>
                </Col>

                <Col
                    md={8}
                    xs={24}
                >
                    <Form
                        form={form}
                        name="payment-form"
                        onFinish={handlePlaceOrder}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <div className="order-sum">
                            <Form.Item<FieldType>
                                label="Payment Method"
                                name="method"
                            >
                                <Radio.Group>
                                    <Space direction="vertical">
                                        <Radio value={'COD'}>
                                            Cash on Delivery
                                        </Radio>
                                        <Radio value={'BANKING'}>
                                            Pay with VNPAY Wallet
                                        </Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Full Name"
                                name="fullName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Full name cannot be empty!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Phone Number"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Phone number cannot be empty!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Shipping Address"
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Address cannot be empty!',
                                    },
                                ]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>

                            <div className="calculate">
                                <span>Subtotal</span>
                                <span>
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(totalPrice || 0)}
                                </span>
                            </div>

                            <Divider style={{ margin: '10px 0' }} />

                            <div className="calculate">
                                <span>Total</span>
                                <span className="sum-final">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(totalPrice || 0)}
                                </span>
                            </div>

                            <Divider style={{ margin: '10px 0' }} />

                            <Button
                                color="danger"
                                variant="solid"
                                htmlType="submit"
                                loading={isSubmit}
                            >
                                Place Order ({carts?.length ?? 0})
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default Payment;
