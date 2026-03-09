import { App, Button, Divider, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './register.scss';
import { registerAPI } from '@/services/api';

type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
};

const RegisterPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message } = App.useApp();
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { fullName, email, password, phone } = values;

        const res = await registerAPI(fullName, email, password, phone);

        if (res?.data) {
            message.success('Register successfully!');
            navigate('/login');
        } else {
            message.error(res.message);
        }

        setIsSubmit(false);
    };

    return (
        <div className="register-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Register</h2>
                            <Divider />
                        </div>
                        <Form
                            name="form-register"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Full Name"
                                name="fullName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Full name is required!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Email is required!',
                                    },
                                    {
                                        type: 'email',
                                        message: 'Invalid email format!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Password is required!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Phone Number"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Phone number is required!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmit}
                                >
                                    Register
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p
                                className="text text-normal"
                                style={{ textAlign: 'center' }}
                            >
                                Already have an account?
                                <span>
                                    <Link to="/login"> Sign In </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;
