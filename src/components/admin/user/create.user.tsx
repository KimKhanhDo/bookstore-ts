import { useState } from 'react';
import { App, Divider, Form, Input, Modal } from 'antd';
import type { FormProps } from 'antd';

import { createUsersAPI } from '@/services/api';

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    fullName: string;
    password: string;
    email: string;
    phone: string;
};

const CreateUser = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { fullName, password, email, phone } = values;
        setIsSubmit(true);
        const res = await createUsersAPI(fullName, email, password, phone);

        if (res && res.data) {
            message.success('User created successfully');
            form.resetFields();
            setOpenModalCreate(false);
            refreshTable();
        } else {
            notification.error({
                message: 'An error occurred',
                description: res.message,
            });
        }

        setIsSubmit(false);
    };

    return (
        <>
            <Modal
                title="Add New User"
                open={openModalCreate}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => {
                    setOpenModalCreate(false);
                    form.resetFields();
                }}
                okText={'Create'}
                cancelText={'Cancel'}
                confirmLoading={isSubmit}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Display Name"
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the display name!',
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
                                message: 'Please enter the password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the email!',
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
                        label="Phone Number"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the phone number!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CreateUser;
