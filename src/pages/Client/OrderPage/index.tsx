import { Breadcrumb, Button, Result, Steps } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import '@/styles/order.scss';
import OrderDetail from '@/components/client/order/OrderDetail';
import Payment from '@/components/client/order/Payment';

const OrderPage = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);

    return (
        <div style={{ background: '#efefef', padding: '20px 0' }}>
            <div
                className="order-container"
                style={{ maxWidth: 1440, margin: '0 auto' }}
            >
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to={'/'}>Home</Link>,
                        },
                        {
                            title: 'Cart Details',
                        },
                    ]}
                />

                {!isMobile && (
                    <div
                        className="order-steps"
                        style={{ marginTop: 10 }}
                    >
                        <Steps
                            size="small"
                            current={currentStep}
                            items={[
                                {
                                    title: 'Order',
                                },
                                {
                                    title: 'Place Order',
                                },
                                {
                                    title: 'Payment',
                                },
                            ]}
                        />
                    </div>
                )}

                {currentStep === 0 && (
                    <OrderDetail setCurrentStep={setCurrentStep} />
                )}

                {currentStep === 1 && (
                    <Payment setCurrentStep={setCurrentStep} />
                )}

                {currentStep === 2 && (
                    <Result
                        status="success"
                        title="Order placed successfully"
                        subTitle="The system has recorded your order information."
                        extra={[
                            <Button key="home">
                                <Link
                                    to={'/'}
                                    type="primary"
                                >
                                    Home
                                </Link>
                            </Button>,
                            <Button key="history">
                                <Link
                                    to={'/history'}
                                    type="primary"
                                >
                                    Purchase History
                                </Link>
                            </Button>,
                        ]}
                    />
                )}
            </div>
        </div>
    );
};

export default OrderPage;
