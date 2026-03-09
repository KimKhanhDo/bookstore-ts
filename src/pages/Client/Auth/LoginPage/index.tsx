import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { App, Button, Divider, Form, Input } from 'antd';
import type { FormProps } from 'antd';

import './login.scss';
import { loginAPI } from '@/services/api';
import { useCurrentApp } from '@/context/AppContext';

type FieldType = {
    username: string;
    password: string;
};

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const { setIsAuthenticated, setUser } = useCurrentApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { username, password } = values;

        const res = await loginAPI(username, password);

        if (res?.data) {
            setIsAuthenticated(true);
            setUser(res.data.user);
            localStorage.setItem('access_token', res.data.access_token);

            message.success('Login successfully!');
            navigate('/');
        } else {
            notification.error({
                message: 'Error',
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
        <div className="login-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Sign In</h2>
                            <Divider />
                        </div>
                        <Form
                            name="login-form"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Email is required!',
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

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmit}
                                >
                                    Sign In
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>

                            {/* <div
                                onClick={() => loginGoogle()}
                                title="Sign in with Google"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 10,
                                    textAlign: 'center',
                                    marginBottom: 25,
                                    cursor: 'pointer',
                                }}
                            >
                                Sign in with
                                <GooglePlusOutlined
                                    style={{ fontSize: 30, color: 'orange' }}
                                />
                            </div> */}

                            <p
                                className="text text-normal"
                                style={{ textAlign: 'center' }}
                            >
                                Don't have an account?
                                <span>
                                    <Link to="/register"> Register </Link>
                                </span>
                            </p>
                            <br />
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
